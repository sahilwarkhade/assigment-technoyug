const express = require('express');
const router = express.Router();
const { getUserProfile } = require('../controllers/User.Controller');
const { protect } = require('../middleware/Auth.middleware');

// @route   GET /api/v1/users/profile
router.get('/profile', protect, getUserProfile);

module.exports = router;