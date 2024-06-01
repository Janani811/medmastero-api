const router = require("express").Router();
const { check } = require("express-validator");

const controller = require("./auth.controller");
const auth = require('./auth.service')();

// ROUTES 

// login
router.post("/login", [
    check('email').isEmail().withMessage('Invalid email address'),
    check('password').not().isEmpty().withMessage('Enter your password.'),
], controller.login);

// signup user.
router.post(
    '/signup',
    [
        check('email').not().isEmpty(),
        check('name').not().isEmpty(),
        check('password').not().isEmpty(),
    ],
    controller.signUp
);

// get current user
router.get('/me', auth.authenticate, controller.me);

// logout user
router.get('/logout', auth.authenticate, controller.logout);

module.exports = router;