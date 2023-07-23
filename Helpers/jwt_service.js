const JWT = require('jsonwebtoken');
const createError = require('http-errors');
const client = require('../Helpers/connection_redis');

const signAccessToken = async (userId) => {
    return new Promise((resolve, reject) => {
        const payload = {
            userId
        }
        const secret = process.env.ACCESS_TOKEN_SECRET;
        const option = {
            expiresIn: '20s'
        }

        JWT.sign(payload, secret, option, (err, token) => {
            if (err) reject(err);
            resolve(token);
        })
    })
}

const verifyAccessToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return next(createError.Unauthorized)
    }
    const bearerToken = authHeader.split(' ');
    const token = bearerToken[1];
    JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
        if (err) {
            if (err.name === 'JsonWebTokenError') {
                return next(createError.Unauthorized());
            }
            return next(createError.Unauthorized(err.message));
        }
        req.payload = payload;
        next();
    })
}

const signRefreshToken = async (userId) => {
    return new Promise((resolve, reject) => {
        const payload = {
            userId
        }
        const secret = process.env.REFRESH_TOKEN_SECRET;
        const option = {
            expiresIn: '1y'
        }

        JWT.sign(payload, secret, option, (err, token) => {
            if (err) reject(err);
            client.set(userId.toString(), token, 'EX', 365 * 24 * 60 * 60, (err, reply) => {
                if (err) {
                    return reject(createError.InternalServerError());
                }
                resolve(token);
            })
            resolve(token);
        })
    })
}

const verifyRefreshToken = async (refreshToken) => {
    return new Promise((resolve, reject) => {
        JWT.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
            if (err) {
                return reject(err);
            }
            client.get(payload.userId, (err, reply) => {
                if (err) {
                    return reject(createError.InternalServerError());
                }
                if (refreshToken === reply) {
                    resolve(payload);
                }
                return reject(createError.InternalServerError());
            });
        })
    });
}

module.exports = { signAccessToken, verifyAccessToken, signRefreshToken, verifyRefreshToken }