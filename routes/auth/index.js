import express from 'express';

import { check, query } from 'express-validator';
import controller from './auth.controller.js';
import authFactory from './auth.service.js';

const auth = authFactory();
const router = express.Router()

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
        check('email').isEmail().withMessage('Invalid email address'),
        check('name').not().isEmpty().withMessage('Enter your name.'),
        check('password').not().isEmpty().withMessage('Enter your password.'),
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

router.post('/my-profile', auth.authenticate, controller.profile_photo);

export default router;