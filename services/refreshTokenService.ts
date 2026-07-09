import { v4 as uuid } from 'uuid';
import type { User, RefreshToken } from '../types/types.ts';
import {invalidateTokenForUser, insertRefreshToken, getRefreshToken} from '../models/refreshTokenModel.ts';

export const generateRefreshToken = async (user: User) : Promise<RefreshToken> => {
    return await generateRefreshTokenFromId(Number(user.id));
}

export const generateRefreshTokenFromId = async (id: number) : Promise<RefreshToken> => {
    await invalidateTokenForUser(id);
    const token = uuid();
    const date = new Date(Date.now() + 60000).toString();
    const refreshToken = await insertRefreshToken(id, token, date);
    return refreshToken;
}

export const invalidateRefreshTokenForUser = (userId: number) => {
    invalidateTokenForUser(userId);
}

export const verifyRefreshToken = async (refreshToken: string) => {
    const refreshTokenData = await getRefreshToken(refreshToken);
    if(!refreshTokenData) {
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