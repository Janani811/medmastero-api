const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

module.exports = {
  // compare user password with hashed password from user record using bcrypt
  comparePasswords: (passwordInHand, passwordInDBHash) => {
    return new Promise((resolve, reject) => {
      bcrypt.compare(passwordInHand, passwordInDBHash, (err, result) => {
        if (result) {
          resolve(result);
        }
        if (err) {
          reject(err);
        }
        reject(new Error('Passwords are not matching!'));
      });
    });
  },

  // create hash and salt password using bcrypt
  encryptPassword: (password) => {
    if (!password) throw new Error('Password is required');

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    return { password: hash, salt };
  },

  // create jwt token using JWTWebToken
  createJWTToken: (user) => {
    return jwt.sign(user, process.env.JWT_SECRET);
  },
};
