const express = require('express');
const createError = require('http-errors');
const userRoute = require('./Routes/user.route');
const db = require('./Config/connection_mogoosedb');
const dotenv = require('dotenv');

dotenv.config();
db.connect();


const app = express();

const PORT = process.env.PORT || 3001;

app.get('/', (req, res, next) => {
    res.send('Home Page');
})

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/user', userRoute);


app.use('/', (req, res, next) => {
    // const error = new Error('Not Found');
    // error.status = 500;
    // next(error);
    next(createError.NotFound(('This route does not exist!')));
})

app.use((err, req, res, next) => {
    res.json({
        status: err.status || 500,
        message: err.message
    })
})


app.listen(PORT, () => {
    console.log(`server on running ${PORT}`);
})