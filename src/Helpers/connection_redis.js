const redis = require('redis');
const client = redis.createClient({
    port: 6379,
    host: '127.0.0.1'
});

client.ping((err, pong) => {
    console.log(pong);
})

client.on('connect', function () {
    console.log('Connected');
})

client.on('error', function (err) {
    console.log('Error ' + err);
});





module.exports = client;