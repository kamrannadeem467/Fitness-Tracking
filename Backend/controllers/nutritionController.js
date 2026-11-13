const Nutrition = require('../models/Nutrition');

// @desc    Log meal/nutrition
// @route   POST /api/nutrition
// @access  Private
const createNutrition = async (req, res) => {
  try {
    const { mealType, foodItems } = req.body;

    if (!mealType || !foodItems || foodItems.length === 0) {
      return res.status(400).json({ message: "Meal type and food items are required" });
    }

    const nutrition = await Nutrition.create({
      userId: req.user._id,
      mealType,
      foodItems,
    });

    res.status(201).json({ message: "Nutrition logged successfully", nutrition });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all nutrition logs
// @route   GET /api/nutrition
// @access  Private
const getNutrition = async (req, res) => {
  try {
    const nutritionLogs = await Nutrition.find({ userId: req.user._id }).sort({ date: -1 });
    res.status(200).json(nutritionLogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update Nutrition Log
// @route   PUT /api/nutrition/:id
// @access  Private
const updateNutrition = async (req, res) => {
  try {
    const { mealType, foodItems } = req.body;

    if (!mealType || !Array.isArray(foodItems) || foodItems.length === 0) {
      return res.status(400).json({ message: "Meal type and food items are required" });
    }

    const updatedNutrition = await Nutrition.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { mealType, foodItems },
      { returnDocument: 'after', runValidators: true }
    );

    if (!updatedNutrition) {
      return res.status(404).json({ message: "Nutrition log not found" });
    }

    res.status(200).json({ success: true, updatedNutrition });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// @desc    Delete nutrition log
// @route   DELETE /api/nutrition/:id
// @access  Private
const deleteNutrition = async (req, res) => {
  try {
    const nutrition = await Nutrition.findById(req.params.id);

    if (!nutrition) {
      return res.status(404).json({ message: "Log not found" });
    }

    if (nutrition.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await nutrition.deleteOne();
    res.status(200).json({ message: "Nutrition log removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createNutrition, getNutrition, updateNutrition, deleteNutrition };