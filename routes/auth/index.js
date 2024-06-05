const router = require("express").Router();
const { check, query } = require("express-validator");

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

// Reset already existing password
router.post(
    '/reset-password',
    [check('email').isEmail().withMessage('Invalid email address')],
    controller.resetPassword
);

// Validate token from email to reset password
router.get('/validate-password-code',
    [
        query('code').not().isEmpty().withMessage('Verification code required')
    ],
    controller.validatePasswordToken);

// Update New Password
router.post('/update-password',
    [
        check('password').not().isEmpty().withMessage('Password should not be empty'),
        check('confirmPassword').not().isEmpty().withMessage('Confirm Password should not be empty'),
        query('code').not().isEmpty().withMessage('Verification code required')
    ],
    controller.updatePassword);

module.exports = router;