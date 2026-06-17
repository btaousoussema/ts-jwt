const db = require('../models/dbconnection.js');
const { validateUser, getUserByEmail } = require('./userController.js');
const jwt = require('jsonwebtoken');
const { generateRefreshToken } = require('../services/refreshTokenService.js');

require('dotenv').config();

const login = async (req, res) => {
    const { email, password} = req.body;
    const user = await getUserByEmail(email);
    if(user === undefined || user === null || email === undefined || password === undefined) {
        res.status(400).send('Missing email or password');
        return;
    }
    const isValidated = await validateUser(email, password);
    if (isValidated) {
            const token = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30s' }); 
            const refreshToken = await generateRefreshToken(user);
            res.cookie('refreshToken', refreshToken.token, { httpOnly: true, secure: true, sameSite: 'Strict' });               
            res.send(`user: ${email}, token: ${token}`);
    } else {
            res.status(401).send('Invalid email or password');
    }
}

module.exports = login;
