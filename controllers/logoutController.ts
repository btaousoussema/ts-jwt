import { invalidateTokenForUser } from '../models/refreshTokenModel.ts';
import { getUserByEmail} from './userController.ts';

import { type Request, type Response } from 'express';
import { type User } from '../types/types.ts'; 


export const logout = async (req: Request, res: Response) => {
    const { email } = req.body;
    const user:User = await getUserByEmail(email);
    if(user === undefined || user === null || email === undefined) {
        res.clearCookie('refreshToken');
        console.log("user not found for email: ", email, user);
        res.sendStatus(204);
    }
    await invalidateTokenForUser(Number(user.id));
    res.clearCookie('refreshToken');
    
    res.sendStatus(204);
}