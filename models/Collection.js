const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CollectionSchema = new Schema({
  name: { type: String, required: true },
  userId: { type: String, required: true },
  numGames: { type: Number, required: true },
  gamesList: { type: Array, required: true },
  playersList: { type: Array },
  isPublic: { type: Boolean },
  timesPlayed: { type: Number }
}, { timestamps: true })

module.exports = mongoose.model('Collection', CollectionSchema)