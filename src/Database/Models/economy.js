const mongoose = require("mongoose");

const economySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  gem: {
    type: Number,
    default: 100,
    max: Number.MAX_SAFE_INTEGER
  },
  treasury: {
    type: Number,
    default: 50,
    max: Number.MAX_SAFE_INTEGER
  },
  luckpotion: {
    type: Number,
    default: 0,
    max: Number.MAX_SAFE_INTEGER
  },
  pepperspray: {
    type: Number,
    default: 0,
    max: Number.MAX_SAFE_INTEGER
  },
  pokeball: {
    type: Number,
    default: 0,
    max: Number.MAX_SAFE_INTEGER
  },
  lastRobbed: {
    type: Date,
    default: null
  },
  daily: {
    type: Date,
    default: null
  },
  bonus: {
    type: Date,
    default: null
  },
  missedDays: {
    type: Number,
    default: 0,
    max: Number.MAX_SAFE_INTEGER
  },
  streak: {
    type: Number,
    default: 0,
    max: Number.MAX_SAFE_INTEGER
  }
});

economySchema.pre("save", async function (next) {
  // Check if gem or treasury contains - or .
  if (String(this.gem).includes('-')) {
    this.gem = 0;
  }
  if (String(this.treasury).includes('-')) {
    this.treasury = 0;
  }
  if (String(this.gem).includes('.')) {
    this.gem = Math.round(this.gem);
  }
  if (String(this.treasury).includes('.')) {
    this.treasury = Math.round(this.treasury);
  }

  // Check if the user already exists in the database
  const existingUser = await Economy.findOne({ userId: this.userId });
  if (!existingUser) {
    // User does not exist, create a new one
    await Economy.create({ userId: this.userId });
  }

  next();
});

const Economy = mongoose.model("Economy", economySchema);
module.exports = Economy;
