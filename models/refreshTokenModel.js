const db = require('./dbConnection.js');


const insertRefreshToken = async (userId, token, expiryDate) => {
    const result = await db.query('INSERT INTO refresh_token (user_id, token, expiry_date, active) SELECT $1, $2, $3, true WHERE NOT EXISTS (SELECT 1 FROM refresh_token WHERE user_id = $1 and active = true) RETURNING *', [userId, token, expiryDate]);
    console.log("inserted refresh token: ", result.rows[0]);
    return result.rows[0];
}

const getRefreshToken = async (token) => {
    const result = await db.query('SELECT * FROM refresh_token WHERE token = $1', [token]);
    return result.rows[0];
}

const invalidateTokenForUser = async (userId) => {
    await db.query('UPDATE refresh_token SET active = false WHERE user_id = $1', [userId]);
}    

module.exports = { insertRefreshToken, getRefreshToken, invalidateTokenForUser };