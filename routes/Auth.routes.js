const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { signupUser, loginUser, refreshToken, logoutUser, verifyEmail } = require('../controllers/Auth.Controller');
const { loginLimiter } = require('../middleware/RateLimiter.middleware');

// @route   POST /api/v1/auth/signup
router.post(
    '/signup', 
    [
        body('fullName', 'Full name is required').not().isEmpty(),
        body('email', 'Please include a valid email').isEmail(),
        body('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
    ],
    signupUser
);

// @route   POST /api/v1/auth/login
router.post(
    '/login',
    loginLimiter, // Apply rate limiting to this route
    [
        body('email', 'Please include a valid email').isEmail(),
        body('password', 'Password is required').exists(),
    ],
    loginUser
);

// @route   GET /api/v1/auth/verify-email
router.get('/verify-email', verifyEmail);

// @route   POST /api/v1/auth/refresh
router.post('/refresh', refreshToken);

// @route   POST /api/v1/auth/logout
router.post('/logout', logoutUser);


module.exports = router;