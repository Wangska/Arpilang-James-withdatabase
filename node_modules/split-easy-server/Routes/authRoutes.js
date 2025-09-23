const express = require('express');
const router = express.Router();
const authController = require('../Controllers/authController');

// API endpoints for frontend
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

module.exports = router;
