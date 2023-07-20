const express = require('express');
const createError = require('http-errors');
const route = express.Router();
const User = require('../Models/user.model');
const { userValidate } = require('../Helpers/validation');
const { signAccessToken, verifyToken, signRefreshToken } = require('../Helpers/jwt_service');

route.post('/register', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const { error } = userValidate(req.body);
        if (error) {
            throw createError(error.details[0].message);
        }
        const isExist = await User.findOne({ email });
        if (isExist) {
            throw createError.Conflict(`${email} is ready been register`);
        }
        const user = new User({
            email,
            password
        })
        const saveUser = await user.save();
        return res.json({
            status: 'register success',
            element: saveUser
        })
    } catch (error) {
        next(error);
    }
})

route.post('/refresh-token', (req, res, next) => {
    res.send('function refresh-token');
})

route.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const { error } = userValidate(req.body);
        if (error) {
            throw createError(error.details[0].message);
        }
        const user = await User.findOne({ email });
        if (!user) {
            throw createError.NotFound('User not register');
        }
        const isValid = await user.isCheckPassword(password);
        if (!isValid) {
            throw createError.Unauthorized()
        }
        const accessToken = await signAccessToken(user._id);
        const refreshToken = await signRefreshToken(user._id);
        return res.json({
            accessToken,
            refreshToken
        })
    } catch (error) {
        next(error);
    }
})

route.post('/logout', (req, res, next) => {
    res.send('function logout');
})

route.get('/getList', verifyToken, async (req, res, next) => {
    const listUsers = await User.find();
    return res.json({
        listUsers
    })
})

module.exports = route;