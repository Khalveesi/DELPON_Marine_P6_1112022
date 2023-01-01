const mongoose = require('mongoose');
const UniqueValidator = require('mongoose-unique-validator');

const sauceSchema = mongoose.Schema({
    userId: {type: String, required: true},
    name: {type: String, required: true, unique: true},
    manufacturer: {type: String, required: true},
    description: {type: String, required: true},
    mainPepper: {type: String, required: true},
    imageUrl: {type: String, required: true},
    heat: {type: Number, min: 1, max: 10, required: true},
    likes: {type: Number, default: 0},
    dislikes: {type: Number, default: 0},
    usersLiked: {type: [String], default: []},
    usersDisliked: {type: [String], default: []},
})

sauceSchema.plugin(UniqueValidator);
module.exports = mongoose.model('Sauce', sauceSchema);