const mongoose = require('mongoose');
const sanitizerPlugin = require('mongoose-sanitizer-plugin');
const sauceValidation = require('../middleware/sauceValidation');

const sauceSchema = mongoose.Schema({
    userId: {type: String, required: true}, // UserId 
    name: {type: String, required: true},   // Nom de la sauce
    manufacturer: {type: String, required: true},   // Manufacturer de la sauce
    description: {type: String, required: true},    // Description de la sauce
    mainPepper: {type: String, required: true}, // Ingredient principal de la sauce
    imageUrl: {type: String, required: true},   // Image de la sauce 
    heat: {type: Number, required: true},   // Puissance de la sauce 
    likes: {type: Number},  // Nombres de likes
    dislikes: {type: Number},   // Nombres de dislikes
    usersLiked: {type: [String]},   // Users qui aimes la sauce 
    usersDisliked: {type: [String]},    // Users qui n'aimes pas la sauce
});


sauceSchema.plugin(sanitizerPlugin);
module.exports = mongoose.model('sauce', sauceSchema);