import express from 'express';
import { logout } from '../controllers/logoutController.ts';
import { jwtAuthentication } from '../middleware/JWTauthentication.ts';

const logoutRouter = express.Router();

logoutRouter.post('/', jwtAuthentication, logout);

export default logoutRouter; 