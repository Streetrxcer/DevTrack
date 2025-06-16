const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const {
  userRegistration,
  userLogin
} = require('../controllers/userControllers');

// Register a new user with a POST request
router.post('/register', userRegistration);

// Login route
router.post('/login', userLogin);

module.exports = router;