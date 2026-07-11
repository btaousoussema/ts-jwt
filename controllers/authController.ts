import {validateUser, getUserByEmail} from './userController.ts';
import jwt from 'jsonwebtoken';
import { generateRefreshToken } from '../services/refreshTokenService.ts';
import {type Request, type CookieOptions, type Response} from 'express';
import 'dotenv/config';
import type { User, RefreshToken } from '../types/types.ts';
import { type customJwtPayload } from '../middleware/JWTauthentication.ts';

export const login = async (req: Request, res: Response) : Promise<void> => {
    const {email, password} : {email : string | undefined, password: string | undefined} = req.body;
    if (email == undefined || password == undefined) {
        res.status(400).send('Missing email or password');
        return;
    }
    const user: User | null = await getUserByEmail(email);
    if(user === null) {
        res.status(400).send('Invalid user');
        return;
    }

    const isValidated: boolean = await validateUser(email, password);
    if (isValidated) {
        const secret: string = process.env.ACCESS_TOKEN_SECRET == undefined ? "" : process.env.ACCESS_TOKEN_SECRET;
        const token: string = jwt.sign({ email }, secret, { expiresIn: '5m' });
        const refreshToken: RefreshToken | null = await generateRefreshToken(user);
        if (refreshToken != null) {
            const cookieOptions : CookieOptions = {
                httpOnly: true,
                secure: true,
                sameSite: 'strict'
            };
            res.cookie('refreshToken', refreshToken.token, cookieOptions);  
        }
        res.send(`user: ${email}, token: ${token}`);
    } else {
            res.status(401).send('Invalid credentials');
    }
}