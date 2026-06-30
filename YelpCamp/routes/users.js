const express = require('express');
const router = express.Router();
const passport = require('passport');
const userController = require('../controller/user');
const catchAsync = require('../utils/catchAsync');
const { storeReturnTo } =require('../middleware');

// register routes
router.route('/register')
    .get(userController.renderRegisterForm)
    .post(catchAsync(userController.createUser));


// login routes
router.route('/login')
    .get(userController.renderLoginForm)
    .post(storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), userController.loginUser);


// logout routes
router.get('/logout', userController.logoutUser);


module.exports = router;