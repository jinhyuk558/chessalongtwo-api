const router = require('express').Router()
const fetch = require('node-fetch')

// see if I want to use queries instead
router.get('/', async (req, res) => {
  const headers = {
    'Accept': 'application/vnd.lichess.v3+json',
    'method': 'GET',
    'Authorization': 'Bearer ' + process.env.lichessToken,
  }
  const url = 
    `https://lichess.org/player/top/7/${req.query.variant}`
  console.log(url)
  const result = await fetch(url, {headers})
  const data = await result.json()
  if (data.error) {
    res.status(500).json(data)
  } else {
    const usernames = data.users.map(user => user.username)
    res.status(200).json(usernames)
  }
  
    
})

module.exports = router
