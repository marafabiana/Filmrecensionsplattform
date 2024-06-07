const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const checkAuth = require('../middlewares/checkAuth');

// Register User /register
router.post('/register', userController.registerUser);

// Login User /login
router.post('/login', userController.loginUser);




module.exports = router;
