import express from 'express';
import { refreshToken } from '../controllers/refreshTokenController.ts';

const refresTokenRouter = express.Router();

refresTokenRouter.post('/', refreshToken);

export default refresTokenRouter;