const express = require('express');
const router = express.Router();
const { 
  createNutrition, 
  getNutrition, 
  deleteNutrition, 
  updateNutrition // 👉 Import kiya
} = require('../controllers/nutritionController');
const { protect } = require('../middleware/authMiddleware');
const { userOnly } = require('../middleware/userMiddleware');

router.route('/').post(protect, userOnly, createNutrition).get(protect, userOnly, getNutrition);

router.route('/:id')
  .put(protect, userOnly, updateNutrition) // 👉 PUT route for updating
  .delete(protect, userOnly, deleteNutrition);

module.exports = router;