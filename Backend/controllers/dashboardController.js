const Workout = require('../models/Workout');
const Nutrition = require('../models/Nutrition');
const Progress = require('../models/Progress');

// @desc    Get dashboard overview data and analytics
// @route   GET /api/dashboard
// @access  Private
const getDashboardData = async (req, res) => {
  try {
    const userId = req.user._id;
    const activityStartDate = new Date();
    activityStartDate.setUTCHours(0, 0, 0, 0);
    activityStartDate.setUTCDate(activityStartDate.getUTCDate() - 8);

    const [
      recentWorkouts,
      recentNutrition,
      workoutActivity,
      nutritionActivity,
      progressHistory,
      totalWorkouts,
      totalNutritionLogs,
    ] = await Promise.all([
      Workout.find({ userId }).sort({ date: -1 }).limit(5),
      Nutrition.find({ userId }).sort({ date: -1 }).limit(5),
      Workout.find({ userId, date: { $gte: activityStartDate } }).select('date').lean(),
      Nutrition.find({ userId, date: { $gte: activityStartDate } })
        .select('date foodItems.calories')
        .lean(),
      Progress.find({ userId })
        .select('date weight')
        .sort({ date: -1 })
        .limit(12)
        .lean(),
      Workout.countDocuments({ userId }),
      Nutrition.countDocuments({ userId }),
    ]);

    progressHistory.reverse();
    const latestProgress = progressHistory[progressHistory.length - 1] || null;

    res.status(200).json({
      success: true,
      stats: {
        totalWorkouts,
        totalNutritionLogs,
        currentWeight: latestProgress ? latestProgress.weight : null,
      },
      recentWorkouts,
      recentNutrition,
      workoutActivity,
      nutritionActivity,
      progressHistory,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardData };