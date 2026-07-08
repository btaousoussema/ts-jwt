import { query } from './dbConnection.ts';

export const insertRefreshToken = async (userId: number, token: string, expiryDate: string) => {
    const result = await query('INSERT INTO refresh_token (user_id, token, expiry_date, active) SELECT $1, $2, $3, true WHERE NOT EXISTS (SELECT 1 FROM refresh_token WHERE user_id = $1 and active = true) RETURNING *', [userId, token, expiryDate]);
    console.log("inserted refresh token: ", result.rows[0]);
    return result.rows[0];
}

export const getRefreshToken = async (token: string) => {
    const result = await query('SELECT * FROM refresh_token WHERE token = $1', [token]);
    return result.rows[0];
}

export const invalidateTokenForUser = async (userId: number) => {
    await query('UPDATE refresh_token SET active = false WHERE user_id = $1', [userId]);
}