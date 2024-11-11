import express from 'express';

const router = express.Router()

// Public access
router.get('/', (req, res) => {
    res.status(200).send("MEDMASTERO API")
});

export default router;