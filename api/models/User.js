const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const UserSchema = new Schema({
    username: { type: String, required: true, unique: true, min: 4, max: 255 },
    password: { type: String, required: true, min: 8, max: 1024 },
});

const UserModel = model('User', UserSchema);
module.exports = UserModel;
