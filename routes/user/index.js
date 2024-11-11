import express from 'express';


import authServiceFactory from '../auth/auth.service.js';
import controller from './user.controller.js';

const router = express.Router()
const authService = authServiceFactory();


// update personal profile
router.post('/', authService.authenticate, controller.updateUser);

export default router;