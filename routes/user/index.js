const router = require("express").Router();

const controller = require("./user.controller");

// update personal profile
router.post('/', controller.updateUser);

module.exports = router;