const postModel = require('../models/postModel');
const { isValidBody, isValidObjectId } = require('../utility/validation')
const { uploadFile } = require("../utility/aws");
const userModel = require('../models/userModel');


const updatePost = async (req, res) => {
    try {
        let data = req.body;
        let { post, postId } = data;

        //mandatory fields 
        if (!isValidBody(postId)) {
            return res.status(400).send({
                status: false,
                message: `postId is required`,
            });
        }


        if (!isValidObjectId(postId)) {
            return res
                .status(400)
                .send({ status: false, message: "Please provide correct userId" });
        }

        //-----------------update postImage---------------------

        let files = req.files;
        if (files && files.length > 0) {
            //upload to s3 and get the uploaded link
            // res.send the link back to frontend/postman
            let updatedImg = await uploadFile(files[0]); //upload file
            post = updatedImg;
        } else {
            return res
                .status(400)
                .send({ status: false, message: "please upload post image" });
        }

        let updatedPost = await postModel.findOneAndUpdate({ _id: postId }, data, { new: true });

        res.status(200).send({ status: true, msg: "post updated", data: updatedPost })
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
};

// TODO  `````````````````````````````````````````````` GET POST````````````````````````````````````````````````

const getPost = async (req,res)=>{
 try{
    let MyId = req.params.userId
    let filter=req.query
    
    
    let {userId,postId} =filter

    let query = { isDeleted: false }
    if(!Object.keys(filter).length){
        
        if(!isValidObjectId(MyId)){
            return res.status(400).send({status:false,message:"invalid Id"})
        }
        const userPost = await postModel.find({userId:MyId})
        if(!userPost.length){
            return res.status(400).send({status:false,message:`No post yet`})
        }
        return res.status(200).send({status:true,data:userPost})
    }
    else{ 

        if(userId){
           
         
            if(!isValidObjectId(userId)){
               return  res.status(400).send({status:false,message:"invalid userId"})
            }

            var check =await userModel.findOne({_id:userId,isDeleted:false})
            if(!check){
               return res.status(404).send({status:false,message :`${userId} is not registered user`})
            }
            else{
                query["userId"]=userId
            }
        }
        if(postId){
           
            if(!isValidObjectId(postId)){
               return res.status(400).send({status:false,message:"invalid postId"})
            } 
            query["postId"]=postId
        }

        

        const checkPost =await postModel.find(query)
        if(!checkPost.length){
          return  res.status(400).send({status:false,message:`${check.userName} not posted yet`})
        }

        return res.status(200).send({status:true,data:checkPost})

    }

 }
 catch (error) {
    res.status(500).send({ status: false, message: error.message });
}

const likePost =async (req,res)=>{
    try{

    }
    catch(error){
        res.status(500).send({ status: false, message: error.message }); 
    }
}

}
module.exports = { updatePost,getPost }