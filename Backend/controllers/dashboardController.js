const Workout = require('../models/Workout');
const Nutrition = require('../models/Nutrition');
const Progress = require('../models/Progress');

// @desc    Get dashboard overview data and analytics
// @route   GET /api/dashboard
// @access  Private
const getDashboardData = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. Recent Workouts (Last 5)
    const recentWorkouts = await Workout.find({ userId }).sort({ date: -1 }).limit(5);

    // 2. Recent Nutrition Logs (Last 5)
    const recentNutrition = await Nutrition.find({ userId }).sort({ date: -1 }).limit(5);

    // 3. Progress History (For charts - sorted chronologically)
    const progressHistory = await Progress.find({ userId }).sort({ date: 1 });

    // 4. Totals / Quick Stats
    const totalWorkouts = await Workout.countDocuments({ userId });
    const totalNutritionLogs = await Nutrition.countDocuments({ userId });
    
    // Latest weight record
    const latestProgress = progressHistory.length > 0 ? progressHistory[progressHistory.length - 1] : null;

    res.status(200).json({
      success: true,
      stats: {
        totalWorkouts,
        totalNutritionLogs,
        currentWeight: latestProgress ? latestProgress.weight : null,
      },
      recentWorkouts,
      recentNutrition,
      progressHistory,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardData };