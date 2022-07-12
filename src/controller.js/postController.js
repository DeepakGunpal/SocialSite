// require("dotenv").config();
import postModel from "../models/postModel.js";
import userModel from "../models/userModel.js";
import { uploadFile } from "../utility/aws.js";
import {  isValidBody } from "../utility/validation.js";



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

export { createPost }
