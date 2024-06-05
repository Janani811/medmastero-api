const UserModel = require("../user/user.model");

const authHelper = require("./auth.helper");
const { validationResult } = require('express-validator');
const { validate } = require("./auth.method");
const { v4 } = require("uuid");

// login user
const login = async (req, res) => {
    // check if email or password send there in body or not
    const error = await validate(req);
    if (Object.keys(error).length) {
        return res.status(400).json({
            validationError: error,
            status: false,
        });
    }

    try {
        // check if user exist in user table 
        const user = await UserModel.getOne({
            us_email: req.body.email,
        });

        // if not, send a message
        if (!user) {
            return res.status(400).json({
                message: 'Your account is not found',
            });
        }

        // compare passwords
        await authHelper.comparePasswords(req.body.password, user.us_password);

        // check if the user account is activated or not, if not send message
        if (user.us_active === 0) {
            return res.status(403).json({
                message: 'Your account is not active.',
            });
        }

        // remove us_password and us_password_salt from the user record
        delete user.us_password;
        delete user.us_password_salt;

        // create jwt token with user data and secret key 
        const jwtToken = authHelper.createJWTToken(user);

        //save token in cookie
        res.cookie('authcookie', jwtToken, { expires: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000), httpOnly: true, secure: true });
        res.cookie('authenticatedCookie', user.us_id, { expires: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000), httpOnly: false });


        return res.status(200).send({
            status: true,
            message: 'Successfully logged in',
            jwtToken,
            user,
        });
    } catch (error) {
        console.log(error.message)
        return res.status(401).json({
            status: false,
            message: 'The email address or password is incorrect.',
            error: error.message 
        });
    }
};


// signup user
const signUp = async (req, res) => {
    try {
        // check if user exist
        const userExists = await UserModel.getOne({
            us_email: req.body.email,
        });

        // if already exist, send a message that user already exist
        if (userExists) {
            return res.status(400).json({
                message: 'The email address you entered is already exists',
                field: 'email',
                status: false,
            });
        }
        // create user encrypt password and salt
        const { password, salt } = authHelper.encryptPassword(req.body.password);

        // setting data to store in user table as per the column name
        const data = {
            us_email: req.body.email,
            us_fullname: req.body.name,
            us_is_active: 1,
            // us_is_deleted: 0,
            us_type: req.body.is_seller ? 3 : 4,
            us_phone_number: req.body.phone,
            us_password: password,
            us_password_salt: salt,
        };


        // create userprofile
        await UserModel.create(data);

        return res.status(200).json({
            status: true,
            message: 'User registered successfully.',
        });
    } catch (error) {
        console.log(error.message)
        return res
            .status(400)
            .json({ status: false, message: 'Your Registration is failed.', error: error.message });
    }
};

// get current user
const me = (req, res) => {
    // send current user
    res.status(200).json({
        status: true,
        user: req.user,
    });
};

// logout user
const logout = (req, res) => {
    // check if authcookie and authenticatedCookie is there 
    if (req.cookies['authcookie'] && req.cookies['authenticatedCookie']) {
        res.clearCookie('authcookie');
        res.clearCookie('authenticatedCookie');
        res.status(200).json({ message: 'You have logged out' });
    } // elsesend a message as Invalid cookie
    else {
        res.status(401).json({ error: 'Invalid Cookie', error: error.message })
    }
};

// Reset Password
const resetPassword = async (req, res) => {
    try {
        // validate email
        const error = await validate(req);
        if (Object.keys(error).length) {
            return res.status(400).json({
                validationError: error,
                status: false,
            });
        }

        // check if user exist
        const userExists = await UserModel.getOne({
            us_email: req.body.email,
        });

        if (!userExists) {
            return res.status(400).json({
                message: "The email address you entered couldn't be found",
                field: 'email',
                status: false,
            });
        }

        // if account is not active, return message
        if (userExists.us_is_active === 0) {
            return res.status(403).json({
                message:
                    'Your account is not active.Please check email to verify your account.',
            });
        }
        // update user with user password token
        const updatedUser = await UserModel.update(
            { us_email: req.body.email, us_is_active: 1 },
            { us_verification_code: v4() }
        );

        // await SendGrid.sendResetPasswordMail({
        //     us_full_name: `${updatedUser.us_full_name}`,
        //     us_email: updatedUser.us_email,
        //     reset_password_url: `${process.env.ROOTURL}/auth/set-password?code=${updatedUser?.us_verification_code}`,
        // });

        return res.status(200).json({
            status: true,
            link: `${process.env.ROOTURL}/auth/set-password?code=${updatedUser?.us_verification_code}`,
            message: 'Password reset successfully',
        });
    } catch (error) {
        console.log(error.message)
        return res
            .status(400)
            .json({ status: false, message: 'Reset password is failed.', error: error.message });
    }
};

// Validate the token from reset password through email 
const validatePasswordToken = async (req, res) => {
    try {
        // Error validation
        const error = await validate(req);
        if (Object.keys(error).length) {
            return res.status(400).json({
                validationError: error,
                status: false,
            });
        }

        // check if user found in the code from query
        const user = await UserModel.getOne({
            us_verification_code: req.query.code,
            us_is_active: 1,
        });

        // if not, return error message
        if (!user) {
            return res
                .status(401)
                .json({
                    validationError: [{
                        message: 'Verification code not found',
                        field: 'code',
                       
                    }], 
                    status: false
                });
        }
        return res.status(200).json({ status: true, user });
    } catch (error) {
        console.log(error.message)
        return res.status(400).json({ status: false, error: error.message });
    }
};

// Update Password
const updatePassword = async (req, res) => {
    try {
        // Error validation
        const error = await validate(req);
        if (Object.keys(error).length) {
            return res.status(400).json({
                validationError: error,
                status: false,
            });
        }

        // check if password and confirm password matches or not
        if (req.body.password !== req.body.confirmPassword) {
            return res.status(400).json({
                validationError: [{
                    message: 'Confirm password mismatch',
                    field: 'confirmPassword',
                   
                }], 
                status: false
            });
        }

        // encrypt password and salt
        const { password, salt } = authHelper.encryptPassword(
            req.body.password
        );

        // update user with the new password
        if (req.query.code) {
            await UserModel.where({
                us_verification_code: req.query.code,
                us_is_active: 1,
            }).save(
                {
                    us_password: password,
                    us_password_salt: salt,
                    us_verification_code: null,
                },
                { patch: true }
            );
        }


        return res.status(200).json({
            status: true,
            message: 'Password Updated Successfully',
        });
    } catch (error) {
        console.log(error.message)
        return res.status(400).json({
            status: false,
            message: 'Failed when resetting password',
            error: error.message 
        });
    }
};

module.exports = { login, signUp, me, logout, resetPassword,validatePasswordToken, updatePassword }