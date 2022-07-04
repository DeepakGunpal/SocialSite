const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    post: { type :  String, required : true, trim: true}, //photo
    caption : { type: String, trim: true}, 
    userId: {type : Objectid, ref : 'user', required : true },
    //tags:[{ type: String, trim: true}], //if user want to tag someone in the pic...   confusion
    likes:{type: Number, trim: true, default:0},
    likedBy:{type: String, trim: true},
    // views:{type: Number, trim: true,default:0}, // video views count
    // viewedBy:{type: String, trim: true}, //if user uploaded/posted any video
    comment: {type: Array, trim: true},
    isDeleted: { type: Boolean, default: false, trim: true },
    deletedAt: { type: Date, default: null }

}, { timestamps: true })

module.exports = mongoose.model('post', postSchema)