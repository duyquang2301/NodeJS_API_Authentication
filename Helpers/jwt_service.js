const JWT = require('jsonwebtoken');
const createError = require('http-errors');

const signAccessToken = async (userId) => {
    return new Promise((resolve, reject) => {
        const payload = {
            userId
        }
        const secret = process.env.ACCESS_TOKEN_SECRET;
        const option = {
            expiresIn: '1h'
        }

        JWT.sign(payload, secret, option, (err, token) => {
            if (err) reject(err);
            resolve(token);
        })
    })
}

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return next(createError.Unauthorized)
    }
    const bearerToken = authHeader.split(' ');
    const token = bearerToken[1];
    JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
        if (err) {
            return next(createError.Unauthorized);
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
            resolve(token);
        })
    })
}

module.exports = { signAccessToken, verifyToken, signRefreshToken }