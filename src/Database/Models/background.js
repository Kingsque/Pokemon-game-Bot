const mongoose = require("mongoose");

const backgroundSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  background: { type: [Object], default: [] },
});

module.exports = mongoose.model("UserBackground", backgroundSchema);