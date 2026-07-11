import express, { type Router } from 'express';
import { refreshToken } from '../controllers/refreshTokenController.ts';

const refresTokenRouter: Router = express.Router();

refresTokenRouter.post('/', refreshToken);

export default refresTokenRouter;