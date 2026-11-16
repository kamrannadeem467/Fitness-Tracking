const express = require('express');
const {
  getWorkoutPlans,
  getOverdueWorkoutPlans,
  createWorkoutPlan,
  updateWorkoutPlan,
  deleteWorkoutPlan,
} = require('../controllers/workoutPlanController');
const { protect } = require('../middleware/authMiddleware');
const { userOnly } = require('../middleware/userMiddleware');

const router = express.Router();

router.route('/')
  .get(protect, userOnly, getWorkoutPlans)
  .post(protect, userOnly, createWorkoutPlan);
router.get('/overdue', protect, userOnly, getOverdueWorkoutPlans);
router.route('/:id')
  .patch(protect, userOnly, updateWorkoutPlan)
  .delete(protect, userOnly, deleteWorkoutPlan);

module.exports = router;
