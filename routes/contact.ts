import express from 'express';
import contactController from '../controllers/contactController.ts';
import { jwtAuthentication } from '../middleware/JWTauthentication.ts';

const contactRouter = express.Router();

contactRouter.get('/', jwtAuthentication, contactController.getContacts);

contactRouter.post('/', jwtAuthentication, contactController.createContact);

export default contactRouter;
