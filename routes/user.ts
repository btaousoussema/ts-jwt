import express from 'express';
const userRouter = express.Router();
import {getUser, getUserById, createUser, loginUser } from '../controllers/userController.ts';


const app = express();

app.use(express.json());

userRouter.get('/', getUser);

userRouter.get('/:id', getUserById);

userRouter.post('/', createUser);

userRouter.post('/login', loginUser);

export default userRouter;