const express = require('express');
const router = express.Router();
const { createProgress, getProgress, updateProgress } = require('../controllers/progressController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, createProgress).get(protect, getProgress);
router.route('/:id').put(protect, updateProgress);

module.exports = router;