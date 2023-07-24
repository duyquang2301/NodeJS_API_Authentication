const mongoose = require('mongoose');


async function connect() {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log("Connect Success");
    } catch (err) {
        console.log("connect failure: " + err);
    }
}

module.exports = { connect };