const express = require('express');
const route = express.Router();
const { verifyAccessToken } = require('../Helpers/jwt_service');

route.post('/register',)

route.post('/refresh-token',)

route.post('/login',)

route.delete('/logout',)

route.get('/getList', verifyAccessToken)

module.exports = route;