
import postModel from "../models/postModel.js";
import userModel from "../models/userModel.js";
import { uploadFile } from "../utility/aws.js";
import {  isValidBody ,isValidObjectId} from "../utility/validation.js";



const createPost = async (req, res) => {
  try {
    let data = req.body;

    // let {post, caption, comment} = data;

    if (!isValidBody(data)) {
        return res.status(400).send({ status: false, message: "post details required" })
    }



    // if (!isValidBody(data.post)) {
    //     return res.status(400).send({status: false,message: 'post is required'});
    // }

    const user = await userModel.findById({ _id: data.userId })
    if (!user) {
        return res.status(404).send({ status: false, message: "userId does not exist" })
    }
    // if (!isValidBody(caption)) {
    //     return res.status(400).send({status: false,message: 'cation is required'});
    // }
    

    //===============upload post image=========//

    let files = req.files;
    if (files && files.length > 0) {
      let uploadPostImage = await uploadFile(files[0]); 
      data.post = uploadPostImage;
    } else {
      return res
        .status(400)
        .send({ status: false, message: "Please upload image" });
    }


    const newPost = await postModel.create(data);
    res.status(201).send({ status: true, message: 'Posted successfull', data: newPost })
  } catch (error) {
    res.status(500).send({ status: false, message: error.message })
  }
}

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

export { createPost , getPost}
