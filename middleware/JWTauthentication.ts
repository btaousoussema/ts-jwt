import 'dotenv/config';
import jwt from 'jsonwebtoken';
import { type Request, type Response } from 'express';

export const jwtAuthentication = (req: Request, res: Response, next: Function) => {
    const authHeader = req.headers['authorization'];
    const secret: string | undefined = process.env.ACCESS_TOKEN_SECRET;
    if (secret === undefined) {
        res.sendStatus(500);
        return;
    }

    const token : string | undefined = authHeader && authHeader.split(' ')[1];
    if (token === undefined) {
        res.sendStatus(401);
        return;
    }

    try {
        const payload = jwt.verify(token,  secret);
        console.log("The payload ********** ", payload);
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