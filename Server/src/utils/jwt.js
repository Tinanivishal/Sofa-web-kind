const jwt = require('jsonwebtoken');
const { ENV } = require('../config/env');

const signAccessToken = (payload) =>
  jwt.sign(payload, ENV.jwt.accessSecret, {
    expiresIn: ENV.jwt.accessExpiresIn,
  });

const signRefreshToken = (payload) =>
  jwt.sign(payload, ENV.jwt.refreshSecret, {
    expiresIn: ENV.jwt.refreshExpiresIn,
  });

const verifyAccessToken = (token) =>
  jwt.verify(token, ENV.jwt.accessSecret);

const verifyRefreshToken = (token) =>
  jwt.verify(token, ENV.jwt.refreshSecret);

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};

