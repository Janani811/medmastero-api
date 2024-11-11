import express from 'express';

const router = express.Router()

import controller from './user_type.controller.js';

router.get("/", controller.getAll);

export default router;