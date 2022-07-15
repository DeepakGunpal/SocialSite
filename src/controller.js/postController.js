
import postModel from "../models/postModel.js";
import userModel from "../models/userModel.js";
import { uploadFile } from "../utility/aws.js";
import { isValidBody, isValidObjectId } from "../utility/validation.js";



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

const getPost = async (req, res) => {
    try {
        let MyId = req.params.userId
        let filter = req.query


        let { userId, postId } = filter

        let query = { isDeleted: false }
        if (!Object.keys(filter).length) {

            if (!isValidObjectId(MyId)) {
                return res.status(400).send({ status: false, message: "invalid Id" })
            }
            const userPost = await postModel.find({ userId: MyId })
            if (!userPost.length) {
                return res.status(400).send({ status: false, message: `No post yet` })
            }
            return res.status(200).send({ status: true, data: userPost })
        }
        else {

            if (userId) {


                if (!isValidObjectId(userId)) {
                    return res.status(400).send({ status: false, message: "invalid userId" })
                }

                var check = await userModel.findOne({ _id: userId, isDeleted: false })
                if (!check) {
                    return res.status(404).send({ status: false, message: `${userId} is not registered user` })
                }
                else {
                    query["userId"] = userId
                }
            }
            if (postId) {

                if (!isValidObjectId(postId)) {
                    return res.status(400).send({ status: false, message: "invalid postId" })
                }
                query["postId"] = postId
            }



            const checkPost = await postModel.find(query)
            if (!checkPost.length) {
                return res.status(400).send({ status: false, message: `${check.userName} not posted yet` })
            }

            return res.status(200).send({ status: true, data: checkPost })

        }

    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}

//------------------------------------------------------------likePost api---------------------------------------------------------------------------------//

const likePost = async (req, res) => {
    try {
        let data = req.body
        let userId = req.params.userId
        let { postId, event } = data

        // check userid
        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: " userId is not correct" })
        }
        const userCheck = await userModel.findOne({ userId: userId, isDeleted: false, isDeactivated: false })
        if (!userCheck) {
            return res.status(400).send({ status: false, message: `${userId} not exist` })
        }

        // check postId
        if (!postId) {
            return res.status(400).send({ status: false, message: "plz provide postId" })
        }
        if (!isValidObjectId(postId)) {
            return res.status(400).send({ status: false, message: " invalid PostId ಥ_ಥ" })
        }
        const checkPostId = await postModel.findOne({ _id: postId, isDeleted: false })
        
        if (!checkPostId) {
            return res.status(400).send({ status: false, message: `${postId} is not present` })
        }

        // check event it can only like,dislike
        if (!event) {
            return res.status(400).send({ status: false, message: "provide event like or dislike " })
        }
        event = event.toString().trim().toLowerCase()
        if (!["like", "dislike"].includes(event)) {
            res.status(400).send({ status: false, message: "event can only be like  or dislike" })
        }

        //  check the presence of userId in likes

        let liked = checkPostId["likedBy"].includes(userId)

        // *conditions---if like && !liked---push userId likes++
        if (event == "like" && !liked) {
            await postModel.findByIdAndUpdate(postId,
                {
                    $addToSet: { likedBy: userId },
                    $inc: { likes: 1 }
                },
                { new: true })

            res.status(200).send({ status: true, message: "succesfully ❤ the post (★‿★)" })
        }

        // 2] if likes&& liked --res already like want to unlike this post
        if (event == "like" && liked) {
            res.status(400).send({ status: false, message: "you have already liked the post ¯\_(ツ)_/¯" })
        }
        // 3]if unlike&& !liked res--do you want to like the post
        if (event == "dislike" && !liked) {
            res.status(400).send({ status: false, message: " do you want to like ❤ this post" })
        }
        // 4] if unlike&& liked pop (userId) like--
        if (event == "dislike" && liked) {
            await postModel.findByIdAndUpdate(postId,
                {
                    $pull: { likedBy: userId },
                    $inc: { likes: -1 }
                },
                { new: true })
                
            res.status(200).send({ status: true, message: "♨_♨  disliked the post 🖤" })
        }
    }

    catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}

//--------------------------------------------------------delete Post API--------------------------------------------------------------------------------------------//

const deletePosts = async (req, res) => {

    try {
           const postId = req.params.postId
           const userId = req.params.userId
   
           if (!isValidBody(postId) ||!isValidObjectId(postId)) {
               return res.status(400).send({ status: false, message: "please enter valid post Id" })
           }
           if (!isValidBody(userId) ||!isValidObjectId(userId)) {
               return res.status(400).send({ status: false, message: "please enter valid user Id" })
           }
           const post = await postModel.findOne({ _id: postId, userId: userId })
           if (!post) {
               return res.status(404).send({ status: false, message: "Not posted yet anything" })
           }
           if (post.isDeleted == true) {
               return res.status(404).send({ status: false, message: "This post has been deleted already or could'nt found" })
           }
   
           const user = await userModel.findById(userId)
           if (!user) {
               return res.status(404).send({ status: false, message: "No user Exists with this userId" })
           }
           if (user.isDeleted == true) {
               return res.status(404).send({ status: false, message: "could'nt find this user or has been already deleted" })
           }
   
          await postModel.findOneAndUpdate({ _id: postId }, { $set: { isDeleted: true }, deletedAt: Date.now() }, { new: true })
          await postModel.findByIdAndUpdate({ _id: postId }, { $inc: { reviews: -1 } }, { new: true })
       
           return res.status(200).send({ status: true, message: "This post has been deleted successfully" })
    }
   
       catch (error) {
           console.log(error.message)
           return res.status(500).send({ status: "error", msg: error.message })
       }
   }
   

export { createPost, getPost, likePost, deletePosts }
