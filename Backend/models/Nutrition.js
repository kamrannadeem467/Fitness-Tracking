const mongoose = require('mongoose');

const nutritionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  mealType: {
    type: String,
    enum: ['breakfast', 'lunch', 'dinner', 'snacks'],
    required: true,
  },
  foodItems: [
    {
      name: { type: String, required: true },
      quantity: { type: String, required: true }, // e.g., "1 bowl", "200g"
      calories: { type: Number, required: true },
      protein: { type: Number, default: 0 }, // in grams
      carbs: { type: Number, default: 0 },
      fats: { type: Number, default: 0 },
    }
  ],
  date: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true });

module.exports = mongoose.model('Nutrition', nutritionSchema);