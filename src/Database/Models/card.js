const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  jid: String,
  Getcard: String,
  claimed: String,
  card_price: Number,
  card_code: Number
});

const Card = mongoose.model('Card', cardSchema);
module.exports = Card
