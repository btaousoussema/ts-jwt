import { query } from './dbConnection.ts';
import type { RefreshToken } from '../types/types.ts';

export const insertRefreshToken = async (userId: number, token: string, expiryDate: string): Promise<RefreshToken> => {
    const result = await query('INSERT INTO refresh_token (user_id, token, expiry_date, active) SELECT $1, $2, $3, true WHERE NOT EXISTS (SELECT 1 FROM refresh_token WHERE user_id = $1 and active = true) RETURNING *', [userId, token, expiryDate]);
    if(result.rows.length === 0) {
        return {} as RefreshToken;
    }
    const refreshToken: RefreshToken = {
        id: result.rows[0].id,
        user_id: result.rows[0].user_id,
        token: result.rows[0].token,
        expiry_date: result.rows[0].expiry_date,
        active: result.rows[0].active
    }
    return refreshToken;
}

export const getRefreshToken = async (token: string): Promise<RefreshToken> => {
    const result = await query('SELECT * FROM refresh_token WHERE token = $1', [token]);
     if(result.rows.length === 0) {
        return {} as RefreshToken;
    }
    const refreshToken: RefreshToken = {
        id: result.rows[0].id,
        user_id: result.rows[0].user_id,
        token: result.rows[0].token,
        expiry_date: result.rows[0].expiry_date,
        active: result.rows[0].active
    }
    return refreshToken;
}

export const invalidateTokenForUser = async (userId: number): Promise<void> => {
    await query('UPDATE refresh_token SET active = false WHERE user_id = $1', [userId]);
}