const express = require('express');
const createError = require('http-errors');
const route = express.Router();
const User = require('../Models/user.model');
const { userValidate } = require('../Helpers/validation');

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

route.post('/login', (req, res, next) => {
    res.send('function login');
})

route.post('/logout', (req, res, next) => {
    res.send('function logout');
})

module.exports = route;