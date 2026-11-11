const Workout = require('../models/Workout');

// @desc    Create a new workout
// @route   POST /api/workouts
// @access  Private
const createWorkout = async (req, res) => {
  try {
    // 1. Check karein ke user authenticated hai ya nahi
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Not authorized, user missing or token invalid" });
    }

    const { title, category, exercises } = req.body;

    if (!title || !exercises || exercises.length === 0) {
      return res.status(400).json({ message: "Title and at least one exercise are required" });
    }

    // 2. Workout create karein
    const workout = await Workout.create({
      userId: req.user._id,
      title,
      category: category || 'strength',
      exercises,
    });

    return res.status(201).json({ message: "Workout created successfully", workout });
  } catch (error) {
    // Yahan exact error backend terminal par print hoga taake pata chale ghalti kahan hai
    console.error("Create Workout Error:", error.message);
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get all workouts for logged-in user
// @route   GET /api/workouts
// @access  Private
const getWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({ userId: req.user._id }).sort({ date: -1 });
    res.status(200).json(workouts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete workout
// @route   DELETE /api/workouts/:id
// @access  Private
const deleteWorkout = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);

    if (!workout) {
      return res.status(404).json({ message: "Workout not found" });
    }

    // Check karein ke wahi user delete kar raha hai jis ka workout hai
    if (workout.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await workout.deleteOne();
    res.status(200).json({ message: "Workout removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createWorkout, getWorkouts, deleteWorkout };