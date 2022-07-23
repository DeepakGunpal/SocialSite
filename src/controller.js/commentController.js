import commentModel from '../models/commentModel.js';
import postModel from '../models/postModel'
import userModel from '../models/userModel'
import {isValidBody, isValidObjectId} from '../utility/validation.js';
import { uploadFile } from "../utility/aws";



const createComment = async function(req, res){
    try{
        let userId = req.params.userId;
        let postId = req.params.postId;
        let data = req.body;
        let files = req.files;
        let{comment} = data

        // check the body has data
        if(!isValidBody(comment)) return res.status(400).send({status: false, message:'Please fill mandatory fields.'})
        // Check ID's
        if (!isValidBody(userId)|| isValidObjectId(userId)) {
            res.status(400).send({status: false, message:"Please! enter a valid user Id"})
        }
        if (!isValidBody(postId)|| isValidObjectId(postId)) {
            res.status(400).send({status: false, message:"Please! enter a valid post Id"})
        }

        // Db call for check user Id and Post Id
        const userCheck = await userModel.findOne({_id: userId, idDeleted: false})
        const postCheck = await postModel.findOne({_id: postId, idDeleted: false})
        if(!userCheck) return res.status(404).send({status: false, msg:'UserId given in params does not exists.'})
        if(!postCheck) return res.status(404).send({status: false, msg:'Post ID given in params does not exists.'})

        if (files && files.length > 0) {
            let uploadPostImage = await uploadFile(files[0]);
            data.post = uploadPostImage;
        } else {
            return res.status(400).send({ status: false, message: "Please upload image" });
        }

        const newCommnet = await commentModel.create(data)
        res.status(201).send({status: true, msg:'commented on Post', data: newCommnet})

    }
    catch(err){
        res.status(500).send({status: false, message: err.message})
    }
}

molude.exports = {createComment}
