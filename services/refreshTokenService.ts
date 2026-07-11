import { v4 as uuid } from 'uuid';
import type { User, RefreshToken } from '../types/types.ts';
import {invalidateTokenForUser, insertRefreshToken, getRefreshToken} from '../models/refreshTokenModel.ts';

export const generateRefreshToken = async (user: User) : Promise<RefreshToken | null> => {
    return await generateRefreshTokenFromId(Number(user.id));
}

export const generateRefreshTokenFromId = async (id: number) : Promise<RefreshToken | null> => {
    await invalidateTokenForUser(id);
    const token: string = uuid();
    const date: string = new Date(Date.now() + 60000).toString();
    const refreshToken: RefreshToken | null = await insertRefreshToken(id, token, date);
    if (refreshToken === null) {
        return null;
    }
    return refreshToken;
}

export const invalidateRefreshTokenForUser = (userId: number): void => {
    invalidateTokenForUser(userId);
}

export const verifyRefreshToken = async (refreshToken: string) => {
    const refreshTokenData: RefreshToken | null = await getRefreshToken(refreshToken);
    if(!refreshTokenData || refreshTokenData === null) {
        console.log("no refresh token data found ", refreshTokenData, " for token: ", refreshToken);
        return null;
    }
    if(!refreshTokenData.active) {
        console.log("refresh token is not active");
        invalidateTokenForUser(refreshTokenData.user_id);
        return null;
    }

    if(refreshTokenData.expiry_date < new Date().toString()) {
        console.log("refresh token is expired, id: " + refreshTokenData.user_id);
        const newRefreshToken = generateRefreshTokenFromId(refreshTokenData.user_id);
        return newRefreshToken;
    }
    return refreshTokenData;
}