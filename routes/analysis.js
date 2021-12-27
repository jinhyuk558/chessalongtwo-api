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




//http://localhost:5000/api/analysis?fen=r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R%20b%20KQkq%20-%203%203