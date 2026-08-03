import 'dotenv/config';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import { type Request, type Response } from 'express';

export interface customJwtPayload extends JwtPayload {
    email: string
}

export const jwtAuthentication = (req: Request, res: Response, next: Function): void => {
    const secret: string | undefined = process.env.ACCESS_TOKEN_SECRET;
    if (secret === undefined) {
        res.sendStatus(500);
        return;
    }

    const authHeader: string | undefined = req.headers['authorization'];
    const token : string | undefined = authHeader && authHeader.split(' ')[1];
    if (token === undefined) {
        res.sendStatus(401);
        return;
    }

    try {
        const payload: customJwtPayload | string = jwt.verify(token,  secret) as customJwtPayload;
        res.locals.user = payload.email; 
        next();
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            console.error('Validation failed: Token has expired.', err.expiredAt);
        } else if (err instanceof jwt.JsonWebTokenError) {
            console.error('Validation failed: Malformed or invalid signature.', err.message);
        } else {
            console.error('An unexpected validation error occurred:', err);
        }
        res.sendStatus(403);
        return;
    }
}