import commentModel from '../models/commentModel.js';
import {isValidBody} from '../utility/validation.js';



const createComment = function(req, res){
    try{
        let userId = req.params.userId;
        let postId = req.params.postId;
        let data = req.body;

        // check the body has data
        if(!isValidBody(data)) return res.status(400).send({status: false, message:'Please fill mandatory fields.'})

        // Db call for check user Id and Post Id
        const userCheck = await findOne({_id: userId, idDeleted: false})
        const postCheck = await findOne({_id: postId, idDeleted: false})


        // Authorization
        

        // post details




    }
    catch(err){
        res.status(500).send({status: false, message: err.message})
    }
}

export {createComment}