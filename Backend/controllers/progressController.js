const Progress = require('../models/Progress');

// @desc    Add progress record (weight, measurements)
// @route   POST /api/progress
// @access  Private
const createProgress = async (req, res) => {
  try {
    const { weight, bodyFatPercentage, measurements, notes } = req.body;

    if (!weight) {
      return res.status(400).json({ message: "Weight is required" });
    }

    const progress = await Progress.create({
      userId: req.user._id,
      weight,
      bodyFatPercentage,
      measurements,
      notes,
    });

    res.status(201).json({ message: "Progress recorded successfully", progress });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// @desc    Get progress history
// @route   GET /api/progress
// @access  Private
const getProgress = async (req, res) => {
  try {
    const progressLogs = await Progress.find({ userId: req.user._id }).sort({ date: 1 }); // Purana se naya chronological order graph ke liye behtar hai
    res.status(200).json(progressLogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a progress record
// @route   PUT /api/progress/:id
// @access  Private
const updateProgress = async (req, res) => {
  try {
    const { weight, bodyFatPercentage, measurements, notes } = req.body;

    if (weight === undefined || weight === null || weight === '') {
      return res.status(400).json({ message: "Weight is required" });
    }

    const updatedProgress = await Progress.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      {
        weight,
        bodyFatPercentage: bodyFatPercentage ?? null,
        notes: notes ?? '',
        'measurements.chest': measurements?.chest ?? null,
        'measurements.waist': measurements?.waist ?? null,
        'measurements.arms': measurements?.arms ?? null,
      },
      { returnDocument: 'after', runValidators: true }
    );

    if (!updatedProgress) {
      return res.status(404).json({ message: "Progress record not found" });
    }

    res.status(200).json({ message: "Progress updated successfully", progress: updatedProgress });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createProgress, getProgress, updateProgress };