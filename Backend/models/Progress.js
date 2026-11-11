const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  weight: {
    type: Number, // in kg or lbs
    required: true,
  },
  bodyFatPercentage: {
    type: Number,
  },
  measurements: {
    chest: Number,
    waist: Number,
    arms: Number,
    thighs: Number,
  },
  notes: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true });

module.exports = mongoose.model('Progress', progressSchema);