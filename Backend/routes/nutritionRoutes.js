const express = require('express');
const router = express.Router();
const { 
  createNutrition, 
  getNutrition, 
  deleteNutrition, 
  updateNutrition // 👉 Import kiya
} = require('../controllers/nutritionController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, createNutrition).get(protect, getNutrition);

router.route('/:id')
  .put(protect, updateNutrition) // 👉 PUT route for updating
  .delete(protect, deleteNutrition);

module.exports = router;