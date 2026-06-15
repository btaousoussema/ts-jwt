const db = require('../database/dbconnection.js');
const { v4: uuid } = require('uuid');


const generateRefreshToken = (user) => {
    const token = uuid();
    const date = new Date(Date.now() + 6000);
    console.log("date: ", date);
    db.query('INSERT INTO refresh_token (user_id, token, expiry_date, active) VALUES ($1, $2, $3, true)', [user.id, token, date]);
    return token;
}

module.exports = generateRefreshToken;