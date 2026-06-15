const db = require('../database/dbconnection.js');
const { validateUser, getUserByEmail } = require('./userController');
const jwt = require('jsonwebtoken');
const generateRefreshToken = require('./refreshTokenController');

require('dotenv').config();

const login = async (req, res) => {
    const { email, password} = req.body;
    const user = await getUserByEmail(email);
    const isValidated = await validateUser(email, password);
    if (isValidated) {
            const token = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30s' }); 
            const refreshToken = generateRefreshToken(user);
            res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'Strict' });               
            res.send(`user: ${email}, token: ${token}`);
    } else {
            res.status(401).send('Invalid email or password');
    }
}

module.exports = login;
