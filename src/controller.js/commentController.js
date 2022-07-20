import commentModel from '../models/commentModel.js';
import {isValidBody} from '../utility/validation.js';
import { uploadFile } from "../utility/aws";



const createComment = async function(req, res){
    try{
        let userId = req.params.userId;
        let postId = req.params.postId;
        let data = req.body;
        let files = req.files;
        let{commnet} = data

        // check the body has data
        if(!isValidBody(data)) return res.status(400).send({status: false, message:'Please fill mandatory fields.'})

        // Db call for check user Id and Post Id
        const userCheck = await findOne({_id: userId, idDeleted: false})
        const postCheck = await findOne({_id: postId, idDeleted: false})
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
