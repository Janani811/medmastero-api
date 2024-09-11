const router = require("express").Router();

// Public access
router.get('/', (req, res) => {
    res.status(200).send("MEDMASTERO API")
});

module.exports = router;