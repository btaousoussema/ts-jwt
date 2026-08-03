import 'dotenv/config';
import jwt from 'jsonwebtoken';
import { type Request, type Response, type CookieOptions} from 'express';
import type { RefreshToken } from '../types/types.ts'; 
import { verifyRefreshToken } from '../services/refreshTokenService.ts';

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
    const refreshTokenFromCookies: string | undefined = req.cookies.refreshToken;

    if (!refreshTokenFromCookies || refreshTokenFromCookies === undefined) {
        res.status(401).json({ message: 'No refresh token provided' });
        return
    }

    const refreshToken: RefreshToken | null = await verifyRefreshToken(refreshTokenFromCookies);
    if (!refreshToken || refreshToken === null) {
        res.clearCookie('refreshToken');
        res.status(403).json({ message: 'Invalid refresh token' });
        return
    }

    const cookieOptions: CookieOptions = {
        httpOnly: true, 
        secure: true, 
        sameSite: 'strict'
    }

    res.cookie('refreshToken', refreshToken.token,  cookieOptions);
    const secret : string | undefined = process.env.ACCESS_TOKEN_SECRET; 
    if (secret === undefined) {
        res.status(500).json({"mess": "The secret for the token is not defined."})
        return
    }               
    const accessToken = jwt.sign({ user_id: refreshToken.user_id, accessToken: refreshToken.token }, secret, { expiresIn: '30s' });     
    res.json({ accessToken });
}