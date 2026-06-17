const { verifyRefreshToken, invalidateRefreshTokenForUser } = require('../Services/refreshTokenService.js');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const refreshToken = async (req, res) => {
    console.log(req.cookies.refreshToken);
    const refreshTokenFromCookies = req.cookies.refreshToken;

    if (!refreshTokenFromCookies) {
        return res.status(401).json({ message: 'No refresh token provided' });
    }

    const refreshToken = await verifyRefreshToken(refreshTokenFromCookies);
    if (!refreshToken) {
        res.clearCookie('refreshToken');
        return res.status(403).json({ message: 'Invalid refresh token' });
    }

    res.cookie('refreshToken', refreshToken.token, { httpOnly: true, secure: true, sameSite: 'Strict' });               
    const accessToken = jwt.sign({ user_id: refreshToken.user_id, accessToken: refreshToken.token }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30s' });     
    res.json({ accessToken });
}

module.exports = refreshToken;