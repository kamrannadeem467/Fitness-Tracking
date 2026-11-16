const express = require('express');
const router = express.Router();
const { getDashboardData } = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');
const { userOnly } = require('../middleware/userMiddleware');

router.route('/').get(protect, userOnly, getDashboardData);

module.exports = router;