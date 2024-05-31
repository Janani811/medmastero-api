const UserType = require("./user_type");
const Auth = require("./auth");

module.exports = function routes(app) {
  app.use('/user-type',UserType);
  app.use('/auth', Auth);
}
