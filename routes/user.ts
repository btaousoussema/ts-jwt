import express, { type Express } from 'express';
const userRouter = express.Router();
import {getAllUsers, getUserById, createUser, loginUser } from '../controllers/userController.ts';


const app: Express = express();

app.use(express.json());

userRouter.get('/', getAllUsers);

userRouter.get('/:id', getUserById);

userRouter.post('/', createUser);

userRouter.post('/login', loginUser);

export default userRouter;