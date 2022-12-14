const e = require("express");
const mongoose = require("mongoose");

const userName = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;
const host = process.env.MONGODB_HOST;
const name = process.env.MONGODB_NAME;

module.exports = mongoose.connect(
    `mongodb+srv://${userName}:${password}@${host}/${name}?retryWrites=true&w=majority`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
);
