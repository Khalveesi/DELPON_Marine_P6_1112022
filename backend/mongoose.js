const mongoose = require("mongoose");

const userName = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;
const host = process.env.MONGODB_HOST;

module.exports = mongoose.connect(
    `mongodb+srv://${userName}:${password}@${host}/?retryWrites=true&w=majority`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
);
