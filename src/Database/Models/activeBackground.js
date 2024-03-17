const mongoose = require("mongoose");

const userDeckbgSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    deckbg: { type: [Object], default: [] , max: 1 },
});

module.exports = mongoose.model("UserDeckbg", userDeckbgSchema);