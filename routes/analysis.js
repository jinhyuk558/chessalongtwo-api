const router = require('express').Router()
const fetch = require('node-fetch')

// see if I want to use queries instead
router.get('/', async (req, res) => {
  const headers = {
    'Accept': 'application/json',
    'method': 'GET',
    'Authorization': 'Bearer ' + process.env.lichessToken,
  }
  const url = 
    `https://lichess.org/api/cloud-eval?fen=${req.query.fen}`
  console.log(url)
  const result = await fetch(url, {headers})
  const data = await result.json()
  console.log(data)
  if (data.error) {
    res.status(500).json(data)
  } else {
    res.status(200).json(data)
  }
  
    
})

module.exports = router

