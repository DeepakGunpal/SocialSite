const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    phone: { type: Number, required: true, trim: true },
    password: { type: String, required: true, trim: true },
    profileImage: { type: String, trim: true },
    bio: { type: String, trim: true },
    follower: { type: Number, default: 0, trim: true }

}, { timestamps: true })

module.exports = mongoose.model('user', userSchema)