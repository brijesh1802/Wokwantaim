const BlacklistToken = require('../models/blacklistToken.model');

const addToBlacklist = async (token, expiry) => {
    const expiryDate = new Date(expiry * 1000);
    const blacklistToken = new BlacklistToken({ token, expiry: expiryDate });
    await blacklistToken.save();
};

const isBlacklisted = async (token) => {
    const blacklistToken = await BlacklistToken.findOne({ token });
    return !!blacklistToken;
};

module.exports = { addToBlacklist, isBlacklisted };