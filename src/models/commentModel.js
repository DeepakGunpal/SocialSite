import mongoose from 'mongoose';
const ObjectId = mongoose.Schema.Types.ObjectId;

const commentSchema = new mongoose.Schema({
    comment: {type: String, required: true, trim: true},
    userId: {type: ObjectId, ref:'user', required: true},
    postId: {type: ObjectId, ref:'post', required: true},
    isLiked: {type: Boolean, defauld: false, trim: true},
    likes:{type: Number, trim: true, default:0},
    likedBy:{type: Array, default:[]},
    isDeleted: {type: Boolean, default: false, trim: true},
    deletedAt: {type:Date, default: null},
    imageFile: {type: String}


}, {timestamps: true})


export default mongoose.model('comment', commentSchema)