const express = require('express');
const router = express.Router();
const { createWorkout, getWorkouts, updateWorkout, deleteWorkout } = require('../controllers/workoutController');
const { protect } = require('../middleware/authMiddleware'); // Aapka auth middleware
const { userOnly } = require('../middleware/userMiddleware');

router.route('/').post(protect, userOnly, createWorkout).get(protect, userOnly, getWorkouts);
// 👉 Yahan PUT route add kar diya hai update ke liye
router.route('/:id').put(protect, userOnly, updateWorkout).delete(protect, userOnly, deleteWorkout);

module.exports = router;