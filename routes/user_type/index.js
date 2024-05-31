const router = require("express").Router();
const controller = require("./user_type.controller");

router.get("/", controller.getAll);

module.exports = router;