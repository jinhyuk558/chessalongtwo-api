const router = require('express').Router()
const User = require('../models/User')
const CryptoJS = require('crypto-js')
const jwt = require('jsonwebtoken')

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
    console.log('Error trying to check for duplicate username/email')
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
    console.log('registered')
    return res.status(201).json(saved)
  } catch (e) {
    console.log('failed to save user')
    return res.status(500).send(e)
  }
  
})

router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username })
    !user && res.status(401).json('wrong credentials')

    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SEC
    )

    const OriginalPassword = hashedPassword.toString(CryptoJS.enc.Utf8)
    OriginalPassword !== req.body.password && res.status(401).json('wrong credentials')

    const accessToken = jwt.sign({
      id: user._id,
    }, process.env.JWT_SEC, {
      expiresIn: '3d'
    })
    const { password, ...others } = user._doc 
    console.log('logged in')
    res.status(200).json({ ...others, accessToken})
  } catch (e) {
    console.log('log in error')
    res.status(500).json(e)
  }
})

module.exports = router