const mongoose = require('mongoose');
const ObjectId=mongoose.Schema.Types.ObjectId


const postSchema = new mongoose.Schema({
    post: { type :  String, required : true, trim: true}, //photo
    caption : { type: String, trim: true}, 
    userId: {type : ObjectId, ref : 'user', required : true },
    //tags:[{ type: String, trim: true}], //if user want to tag someone in the pic...   confusion
    likes:{type: Number, trim: true, default:0},
    likedBy:{type: Array, default:[]},
    // views:{type: Number, trim: true,default:0}, // video views count
    // viewedBy:{type: String, trim: true}, //if user uploaded/posted any video
    comment: {type: Array, trim: true},

    isDeleted: { type: Boolean, default: false, trim: true },
    deletedAt: { type: Date, default: null }

}, { timestamps: true })

module.exports = mongoose.model('post', postSchema)