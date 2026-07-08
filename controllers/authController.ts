import {validateUser, getUserByEmail} from './userController.ts';
import jwt from 'jsonwebtoken';
import { generateRefreshToken } from '../services/refreshTokenService.ts';
import {type Request, type CookieOptions, type Response} from 'express';
import 'dotenv/config';

export const login = async (req: Request, res: Response) => {
    const { email, password} = req.body;
    const user = await getUserByEmail(email);
    if(user === undefined || user === null || email === undefined || password === undefined) {
        res.status(400).send('Missing email or password');
        return;
    }
    const isValidated = await validateUser(email, password);
    if (isValidated) {
            const secret: string = process.env.ACCESS_TOKEN_SECRET == undefined ? "" : process.env.ACCESS_TOKEN_SECRET;
            const token = jwt.sign({ email }, secret, { expiresIn: '5min' }); 
            const refreshToken = await generateRefreshToken(user);
            const cookieOptions : CookieOptions = {
                httpOnly: true,
                secure: true,
                sameSite: 'strict'
            };
            res.cookie('refreshToken', refreshToken.token, cookieOptions);               
            res.send(`user: ${email}, token: ${token}`);
    } else {
            res.status(401).send('Invalid email or password');
    }
}