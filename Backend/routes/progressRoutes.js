const express = require('express');
const router = express.Router();
const { createProgress, getProgress } = require('../controllers/progressController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, createProgress).get(protect, getProgress);

module.exports = router;