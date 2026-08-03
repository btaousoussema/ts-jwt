import express, { type Router } from 'express';
import { login } from '../controllers/authController.ts';

const authRouter: Router = express.Router();

authRouter.post('/', login);

export default authRouter;