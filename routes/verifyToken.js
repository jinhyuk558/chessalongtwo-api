const jwt = require('jsonwebtoken')
const util = require('util')

const verifyToken = (req, res, next) => {
  console.log('Request: ' + req.headers['x-access-token'])
  const token = req.headers['x-access-token']
  console.log('first check: ' + req.params.userId)
  console.log('TOKEN CHECK: ' + token)
  if (token) {
    console.log('trying to verify token below')
    jwt.verify(token, process.env.JWT_SEC, (err, user) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          console.log('token expired')
          return res.status(403).json(err)
        } else {
          console.log('token not valid')
          return res.status(401).json(err)
        }
        
        
      
      } 
      
      req.user = user 
      req.tokenUserId = user.id
      console.log('token is valid!')
      next()
    })
  } else {
    console.log('no token')
    return res.status(401).json('You are not authenticated')
  }
}

const verifyTokenAndAuthorization = (req, res, next) => {
  //console.log(util.inspect(req),{showHidden: false, depth: null, colors: true})
  //console.log(req.body)
  verifyToken(req, res, () => {
    console.log('First: ' + req.user.id + ' Second: ' + req.body.userId)
    if (req.user.id === req.params.userId) {
      next()
    } else {
      res.status(401).json('You are not allowed to do that')
    }
  })
}


module.exports = {
  verifyToken,
  verifyTokenAndAuthorization
}

// NOW: Yes! The token is up to date. However, why is the token not valid?