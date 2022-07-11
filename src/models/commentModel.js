const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    comment: {type: String, required: true, trim: true},
    userId: {type: ObjectId, ref:'user', required: true},
    isDeleted: {type: Boolean, default: false, trim: true},
    deletedAt: {type:Date, default: null}


}, {timestamps: true})


module.exports = mongoose.model('comment', commentSchema)