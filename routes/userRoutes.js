const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const checkAuth = require('../middlewares/checkAuth');

// POST /register
router.post('/register', userController.registerUser);

// POST User /login
router.post('/login', userController.loginUser);

module.exports = router;
