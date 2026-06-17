const db = require('../models/dbConnection.js');
const { v4: uuid } = require('uuid');
const refreshTokenModel = require('../models/refreshTokenModel.js');

const generateRefreshToken = async (user) => {
    return await generateRefreshTokenFromId(user.id);
}

const generateRefreshTokenFromId = async (id) => {
    await refreshTokenModel.invalidateTokenForUser(id);
    const token = uuid();
    const date = new Date(Date.now() + 60000);
    console.log("date: ", date);
    const refreshToken = await refreshTokenModel.insertRefreshToken(id, token, date);
    return refreshToken;
}

const invalidateRefreshTokenForUser = (userId) => {
    refreshTokenModel.invalidateTokenForUser(userId);
}

const verifyRefreshToken = async (refreshToken) => {
    const refreshTokenData = await refreshTokenModel.getRefreshToken(refreshToken);
    if(!refreshTokenData) {
        console.log("no refresh token data found ", refreshTokenData, " for token: ", refreshToken);
        return null;
    }
    console.log("refresh token data: ", refreshTokenData.active);
    if(!refreshTokenData.active) {
        console.log("refresh token is not active");
        refreshTokenModel.invalidateTokenForUser(refreshTokenData.user_id);
        return null;
    }

    if(refreshTokenData.expiry_date < new Date()) {
        console.log("refresh token is expired, id: " + refreshTokenData.user_id);
        const newRefreshToken = generateRefreshTokenFromId({id: refreshTokenData.user_id});
        return newRefreshToken;
    }
    return refreshTokenData;
}

module.exports = { generateRefreshToken, verifyRefreshToken, invalidateRefreshTokenForUser };