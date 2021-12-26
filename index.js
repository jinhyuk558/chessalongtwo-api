require('dotenv').config()
const express = require('express')
const fetch = require('node-fetch')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const readStream = require('./nodejs-ndjson-stream-reader')
const authRoutes = require('./routes/auth')
const collectionRoutes = require('./routes/collection')
const app = express()


app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

mongoose.connect(process.env.MONGO)
  .then(() => console.log('connected to DB'))
  .catch(e => console.log(e))

app.use('/api/auth', authRoutes)
app.use('/api/collection', collectionRoutes)



// example: http://localhost:5000/api/games?max=10&prefType=blitz&username=DrNykterstein
app.get('/api/games', (req, res) => {
  // console.log(req.query.max)
  // console.log(req.query.prefType)
  // console.log(req.query.username)
  const max = req.query.max 
  const prefType = req.query.prefType 
  const username = req.query.username
  
  let games = []
  const headers = {
    'Accept': 'application/x-ndjson',
    'Authorization': 'Bearer ' + process.env.lichessToken,
  }
  const url = `https://lichess.org/api/games/user/${username}?max=${max}&perfType=${prefType}`
  console.log(url)
  const stream = fetch(url, { headers })
  const onMessage = obj => {
    games.push(obj)
  }
  const onComplete = () => {
    console.log('The stream has completed. Below is the list of games')
    console.log(games)
    res.json(games)
  }
  stream
    .then(
      readStream(onMessage)
    )
    .catch(() => {
      return res.status(500).send('Some error')
    })
    .then(onComplete)
    
})

app.listen(5000, () => console.log('app listening on 5000 ...'))

// ?max=a&perfType=b&username=c