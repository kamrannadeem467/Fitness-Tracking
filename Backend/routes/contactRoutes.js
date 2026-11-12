const express = require('express');
const router = express.Router();
const { submitContactForm, getAllMessages, deleteMessage } = require('../controllers/contactController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

// Public route for submitting contact form
router.post('/', submitContactForm);

// Admin route to view all contact messages
router.get('/messages', protect, adminOnly, getAllMessages);

router.delete('/messages/:id', protect, adminOnly, deleteMessage);

module.exports = router;