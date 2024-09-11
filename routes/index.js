const UserType = require("./user_type");
const Auth = require("./auth");
const User = require("./user");
const Public = require("./public");

module.exports = function routes(app) {
  app.use('/', Public)
  app.use('/user-type', UserType);
  app.use('/auth', Auth);
  app.use('/user', User);
}
