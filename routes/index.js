const UserType = require("./user_type");
const Auth = require("./auth");
const User = require("./user");
const authService = require("./auth/auth.service")();

module.exports = function routes(app) {
  app.use('/user-type',UserType);
  app.use('/auth', Auth);
  app.use('/user',authService.authenticate, User);
}
