const router = require('express').Router()
const User = require('../models/User')
const CryptoJS = require('crypto-js')
const jwt = require('jsonwebtoken')
const RefreshToken = require('../models/RefreshToken')

router.post('/register', async (req, res) => {

  try {
    const duplicate = await User.findOne({ username: req.body.username })
    console.log(duplicate)
    if (duplicate) {
      console.log('duplicate username')
      return res.status(500).send('Is duplicate username')
    }
    const duplicateEmail = await User.findOne({ email: req.body.email })
    if (duplicateEmail) {
      console.log('duplicate email')
      return res.status(500).send('Is duplicate email')
    } 
  } catch (e) {
    return res.status(500).send('Error trying to check for duplicate username/email')
  }
  

  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password, process.env.PASS_SEC).toString()
  })
  console.log(user)

  // save user
  try {
    const saved = await user.save()
    

    const accessToken = jwt.sign({
      id: saved._id,
    }, process.env.JWT_SEC, {
      expiresIn: '3d'
    })
    let refreshToken = await RefreshToken.createToken(user)
    const { password, ...others } = saved._doc 
    return res.status(201).json({ ...others, accessToken, refreshToken})

  } catch (e) {
    console.log('failed to save user')
    return res.status(500).send(e)
  }
  
})

router.post('/login', async (req, res) => {
  console.log('request received')
  try {
    const user = await User.findOne({ username: req.body.username })
    if (!user) return res.status(401).json('wrong credentials')

    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SEC
    )

    const OriginalPassword = hashedPassword.toString(CryptoJS.enc.Utf8)
    if (OriginalPassword !== req.body.password) {
      return res.status(401).json('wrong credentials')
    }
     

    const accessToken = jwt.sign({
      id: user._id,
    }, process.env.JWT_SEC, {
      expiresIn: '1h'
    })

    let refreshToken = await RefreshToken.createToken(user)

    const { password, ...others } = user._doc 
    console.log('logged in')
    return res.status(200).json({ ...others, accessToken, refreshToken})
  } catch (e) {
    console.log('log in error')
    return res.status(500).json(e)
  }
})
refreshToken = async (req, res) => {
  const { refreshToken: requestToken } = req.body 

  if (requestToken === null) {
    return res.status(403).json({ message: 'Refresh token required' })
  }

  try {
    let refreshToken = await RefreshToken.findOne({ token: requestToken })

    if (!refreshToken) {
      return res.status(403).json({ message: 'Refresh token not in database' })
       
    }

    if (RefreshToken.verifyExpiration(refreshToken)) {
      RefreshToken.findByIdAndRemove(refreshToken._id, { useFindAndModify: false }).exec()

      return res.status(401).json({
        do: 'logout',
        message: 'Refresh token was expired. Please make a new login request'
      })
      
    }

    let newAccessToken = jwt.sign({ id: refreshToken.user._id }, process.env.JWT_SEC, {
      expiresIn: process.env.JWT_EXP
    })

    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: refreshToken.token
    })
  } catch (err) {
    console.log(err)
    return res.status(500).send({message: err})
  }
}

router.post('/refreshtoken', refreshToken)

module.exports = router


