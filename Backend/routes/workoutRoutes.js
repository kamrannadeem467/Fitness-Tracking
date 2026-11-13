const express = require('express');
const router = express.Router();
const { createWorkout, getWorkouts, updateWorkout, deleteWorkout } = require('../controllers/workoutController');
const { protect } = require('../middleware/authMiddleware'); // Aapka auth middleware

router.route('/').post(protect, createWorkout).get(protect, getWorkouts);
// 👉 Yahan PUT route add kar diya hai update ke liye
router.route('/:id').put(protect, updateWorkout).delete(protect, deleteWorkout);

module.exports = router;