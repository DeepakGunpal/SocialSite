import commentModel from '../models/commentModel.js';
import {isValidBody, isValidObjectId} from '../utility/validation.js';



const createComment = async function(req, res){
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

const getComment = function(req, res){
    try{
        let {userId, postId} = req.params
        let arr = [userId, postId]
        // if (!isValidBody(userId)) {
        //     return res.status(400).send({ status: false, message: "Please Provide User Id" })
        //   }
        //   if (!isValidObjectId(userId)) {
        //     return res.status(400).send({ status: false, message: "invalid userId" })
        //   }
        //   if (!isValidBody(postId)) {
        //     return res.status(400).send({ status: false, message: "Please Provide Post Id" })
        //   }
        //   if (!isValidObjectId(postId)) {
        //     return res.status(400).send({ status: false, message: "invalid PostId" })
        //   }
          for(let i =0; i< arr.length; i++){
            console.log(arr[i])
            if (!isValidBody(arr[i])) {
                return res.status(400).send({ status: false, message: `Please Provide ${arr[i]}` })
            }
            if (!isValidObjectId(arr[i])) {
                return res.status(400).send({ status: false, message: `Invalid ${arr[i]}` })
            }
          }
    }
    catch(err){
        return res.status(500).send({status: false, message: err.message})
    }
}

export {createComment, getComment}