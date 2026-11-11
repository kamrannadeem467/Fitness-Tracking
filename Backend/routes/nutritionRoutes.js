const express = require('express');
const router = express.Router();
const { createNutrition, getNutrition, deleteNutrition } = require('../controllers/nutritionController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, createNutrition).get(protect, getNutrition);
router.route('/:id').delete(protect, deleteNutrition);

module.exports = router;