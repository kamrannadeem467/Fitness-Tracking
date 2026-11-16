const express = require('express');
const router = express.Router();
const { createProgress, getProgress, updateProgress } = require('../controllers/progressController');
const { protect } = require('../middleware/authMiddleware');
const { userOnly } = require('../middleware/userMiddleware');

router.route('/').post(protect, userOnly, createProgress).get(protect, userOnly, getProgress);
router.route('/:id').put(protect, userOnly, updateProgress);

module.exports = router;