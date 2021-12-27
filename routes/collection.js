const router = require('express').Router()
const Collection = require('../models/Collection')

router.post('/', async (req, res) => {
  const newCollection = new Collection(req.body)
  try {
    const savedUser = await newCollection.save()
    console.log('collection saved')
    return res.status(201).json(savedUser)
  } catch (e) {
    return res.status(500).json(e)
  }
})

// see if I want to use queries instead
router.get('/:id', async (req, res) => {
  console.log('id: ' + req.params.id)
  try {
    const collection = await Collection.findById(req.params.id)
    console.log(collection)
    console.log('successfully retrieved collection')
    return res.status(200).json(collection)
  } catch (e) {
    console.log('error retrieving collection')
    return res.status(500).json(e)
  }
})

// get list of all collections with given user Id
router.get('/user/:userId', async (req, res) => {
  console.log('userId: ' + req.params.userId)
  try {
    const userId = req.params.userId
    const userCollections = await Collection.find({ userId })
    console.log(userCollections)
    return res.status(200).json(userCollections)
  } catch (e) {
    console.log('error retrieving this user collections')
    return res.status(500).json(e)
  }
})

module.exports = router