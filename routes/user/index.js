const router = require("express").Router();

const authService = require("../auth/auth.service")();
const controller = require("./user.controller");


// update personal profile
router.post('/', authService.authenticate, controller.updateUser);

module.exports = router;