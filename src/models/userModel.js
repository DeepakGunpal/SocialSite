const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    gender: { type: String, required: true, trim: true, enum: ["Male", "Female", "LGBTQ", "Prefer not to say"] },//drop down list
    email: { type: String, required: true, unique: true, trim: true },
    phone: { type: Number, required: true, trim: true },
    password: { type: String, required: true, trim: true },
    profileImage: { type: String },
    bio: { type: String, trim: true },
    noOfFollower: { type: Number, default: 0 },
    followers: { type: Array, default: [] },
    following: { type: Array, default: [] },
    isDeleted: { type: Boolean, required: true, trim: true },
    deletedAt: { type: Date, default: null }

}, { timestamps: true })

module.exports = mongoose.model('user', userSchema)