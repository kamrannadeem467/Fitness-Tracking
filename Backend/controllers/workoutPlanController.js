const WorkoutPlan = require('../models/WorkoutPlan');

const isValidDate = (value) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) {
    return false;
  }

  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
};

const getWorkoutPlans = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!isValidDate(startDate) || !isValidDate(endDate) || startDate > endDate) {
      return res.status(400).json({ message: 'A valid startDate and endDate are required.' });
    }

    const plans = await WorkoutPlan.find({
      userId: req.user._id,
      planDate: { $gte: startDate, $lte: endDate },
    }).sort({ planDate: 1, createdAt: 1 });

    return res.status(200).json(plans);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getOverdueWorkoutPlans = async (req, res) => {
  try {
    const { today } = req.query;

    if (!isValidDate(today)) {
      return res.status(400).json({ message: 'A valid today date is required.' });
    }

    const plans = await WorkoutPlan.find({
      userId: req.user._id,
      completed: false,
      planDate: { $lt: today },
    }).sort({ planDate: 1, createdAt: 1 });

    return res.status(200).json(plans);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const createWorkoutPlan = async (req, res) => {
  try {
    const { title, category, planDate } = req.body;

    if (typeof title !== 'string' || !title.trim() || !isValidDate(planDate)) {
      return res.status(400).json({ message: 'A workout name and valid date are required.' });
    }

    const plan = await WorkoutPlan.create({
      userId: req.user._id,
      title: title.trim(),
      category,
      planDate,
    });

    return res.status(201).json(plan);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: error.message });
  }
};

const updateWorkoutPlan = async (req, res) => {
  try {
    if (typeof req.body.completed !== 'boolean') {
      return res.status(400).json({ message: 'Completion status must be true or false.' });
    }

    const plan = await WorkoutPlan.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { completed: req.body.completed },
      { new: true, runValidators: true },
    );

    if (!plan) {
      return res.status(404).json({ message: 'Workout plan not found.' });
    }

    return res.status(200).json(plan);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteWorkoutPlan = async (req, res) => {
  try {
    const plan = await WorkoutPlan.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!plan) {
      return res.status(404).json({ message: 'Workout plan not found.' });
    }

    return res.status(200).json({ message: 'Workout plan removed.' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getWorkoutPlans,
  getOverdueWorkoutPlans,
  createWorkoutPlan,
  updateWorkoutPlan,
  deleteWorkoutPlan,
};
