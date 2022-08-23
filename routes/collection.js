const router = require('express').Router()
const Collection = require('../models/Collection')
const { verifyTokenAndAuthorization, verifyToken } = require('./verifyToken')

router.post('/:userId', verifyTokenAndAuthorization, async (req, res) => {
  console.log('below is the req.body test')
  //console.log(req.body)
  const newCollection = new Collection(req.body)
  try {
    const savedUser = await newCollection.save()
    console.log('collection saved')
    return res.status(201).json(savedUser)
  } catch (e) {
    return res.status(500).json(e)
  }
})

// check if token userId matches with collection userId

router.get('/user/:id/:userId', verifyTokenAndAuthorization, async (req, res) => {
  console.log('id: ' + req.params.id)
  try {
    const collection = await Collection.findById(req.params.id)
    if (collection.isPublic) {
      return res.status(200).json(collection)
    }
    console.log(collection)
    console.log('successfully retrieved collection')
    console.log('Comparison 2: ' + collection.userId + ', ' + req.tokenUserId)
    if (collection.userId === req.tokenUserId) {
      return res.status(200).json(collection)
    } else {
      return res.status(401).json("You are not authorized to view this")
    }
    
   
  } catch (e) {
    console.log('error retrieving collection')
    return res.status(500).json(e)
  }
})

// get list of all collections with given user Id
// this endpoint is for when user is logged in and 
// wants to see their collection (both private and public)
router.get('/user/:userId', verifyTokenAndAuthorization, async (req, res) => {
  console.log('userId: ' + req.params.userId)
  try {
    const userId = req.params.userId
    const userCollections = await Collection.find({ userId })
    //console.log(userCollections)
    return res.status(200).json(userCollections)
  } catch (e) {
    console.log('error retrieving this user collections')
    return res.status(500).json(e)
  }
})

// increment "timesPlayed" whenver collection is played
router.put('/increment/:id', async (req, res) => {
  try {
    const updateReport = await Collection.updateOne(
      {_id: req.params.id},
      { $inc: { 'timesPlayed': 1 } }
    )
    res.status(200).json(updateReport)
  } catch (e) {
    res.status(500).json(e)
  }
})


// get a list of the top 5 most popular public collections
router.get('/sorted/popular', async (req, res) => {
  try {
    console.log('trying to get popular games')
    const topTenList = await Collection.find({ isPublic: true }).sort({ timesPlayed: -1 }).limit(7)
    console.log('below is top ten list')
    res.status(200).json(topTenList)
  } catch (e) {
    console.log('error trying to get popular games')
    res.status(500).json(e)
  }
})


module.exports = router
