import commentModel from "../models/commentModel.js";
import postModel from "../models/postModel.js";
import userModel from "../models/userModel.js";
import {
  isValidBody,
  isValidObjectId,
  validFileRegex,
  isValidImageType,
} from "../utility/validation.js";
import { uploadFile } from "../utility/aws.js";
import { likePost } from "./postController.js";

const createComment = async function (req, res) {
  try {
    let userId = req.params.userId;
    let postId = req.params.postId;
    let data = req.body;
    let files = req.files;
    let { comment } = data;

    // check the body has data
    if (!isValidBody(comment))
      return res
        .status(400)
        .send({ status: false, message: "Please fill mandatory fields." });
    // Check ID's
    if (!isValidBody(userId) || !isValidObjectId(userId)) {
      return res
        .status(400)
        .send({ status: false, message: "Please! enter a valid user Id" });
    }
    if (!isValidBody(postId) || !isValidObjectId(postId)) {
      return res
        .status(400)
        .send({ status: false, message: "Please! enter a valid post Id" });
    }

    // Db call for check user Id and Post Id
    const userCheck = await userModel.findOne({
      _id: userId,
      idDeleted: false,
    });
    const postCheck = await postModel.findOne({
      _id: postId,
      idDeleted: false,
    });
    if (!userCheck)
      return res.status(404).send({
        status: false,
        msg: "UserId given in params does not exists.",
      });
    if (!postCheck)
      return res.status(404).send({
        status: false,
        msg: "Post ID given in params does not exists.",
      });

    if (files && files.length > 0) {
      let uploadPostImage = await uploadFile(files[0]);
      data["imageFile"] = uploadPostImage;
    }

    data["postId"] = postId;
    data["userId"] = userId;
    console.log(data);

    const newCommnet = await commentModel.create(data);
    res
      .status(201)
      .send({ status: true, msg: "commented on Post", data: newCommnet });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

const getComment = async function (req, res) {
  try {
    let { userId, postId } = req.params;
    if (!isValidBody(userId) || !isValidObjectId(userId)) {
      return res
        .status(400)
        .send({ status: false, message: "Please! enter a valid user Id" });
    }
    if (!isValidBody(postId) || !isValidObjectId(postId)) {
      return res
        .status(400)
        .send({ status: false, message: "Please! enter a valid post Id" });
    }
    let user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(400)
        .send({ status: false, message: "User not found!" });
    }
    let post = await postModel.findById(postId);
    if (!post) {
      return res
        .status(400)
        .send({ status: false, message: "Post not found!" });
    }

    let comment = await commentModel.find({ postId: postId, isDeleted: false });

    return res.status(200).send({ data: comment });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

const updatedcomment = async function (req, res) {
  try {
    let userId = req.params.userId;
    let postId = req.params.postId;
    let commentId = req.params.commentId;
    let data = req.body;
    let files = req.files;
    let { comment } = data;

    // check the body has data
    if (!isValidBody(comment))
      return res
        .status(400)
        .send({ status: false, message: "Please fill mandatory fields." });
    // Check ID's
    if (!isValidBody(userId) || !isValidObjectId(userId)) {
      return res
        .status(400)
        .send({ status: false, message: "Please! enter a valid user Id" });
    }
    if (!isValidBody(postId) || !isValidObjectId(postId)) {
      return res
        .status(400)
        .send({ status: false, message: "Please! enter a valid post Id" });
    }
    if (!isValidBody(commentId) || !isValidObjectId(commentId)) {
      return res
        .status(400)
        .send({ status: false, message: "Please! enter a valid commentId" });
    }

    // Db call for check user Id and Post Id
    const userCheck = await userModel.findOne({
      _id: userId,
      idDeleted: false,
    });
    const postCheck = await postModel.findOne({
      _id: postId,
      idDeleted: false,
    });
    if (!userCheck)
      return res.status(404).send({
        status: false,
        msg: "UserId given in params does not exists.",
      });
    if (!postCheck)
      return res.status(404).send({
        status: false,
        msg: "Post ID given in params does not exists.",
      });

    if (files && files.length > 0) {
      let uploadPostImage = await uploadFile(files[0]);
      data["imageFile"] = uploadPostImage;
    }

    const updatedReview = await commentModel.findByIdAndUpdate(
      { _id: commentId },
      { $set: { comment: comment } },
      { new: true }
    );

    data.comment = updatedReview;

    return res.status(200).send({
      status: true,
      message: "comments updated",
    });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

const deleteComment = async function (req, res) {
  try {
    let { commentId, postId, userId } = req.params;

    if (!isValidBody(userId) || !isValidObjectId(userId)) {
      return res
        .status(400)
        .send({ status: false, message: "Please! enter a valid user Id" });
    }
    if (!isValidBody(postId) || !isValidObjectId(postId)) {
      return res
        .status(400)
        .send({ status: false, message: "Please! enter a valid post Id" });
    }
    if (!isValidBody(commentId) || !isValidObjectId(commentId)) {
      return res
        .status(400)
        .send({ status: false, message: "Please! enter a valid comment Id" });
    }

    let user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(400)
        .send({ status: false, message: "User not found!" });
    }

    let validpost = await postModel.findOne({
      _id: postId,
      isDeleted: false,
    });
    if (!validpost) {
      return res.status(404).send({ status: false, message: "NO post found" });
    }

    let validcommentId = await commentModel.findOne({
      _id: commentId,
      isDeleted: false,
    });
    if (!validcommentId) {
      return res
        .status(404)
        .send({ status: false, message: "comment does not exist" });
    }

    if (postId != validcommentId.postId) {
      return res
        .status(400)
        .send({ status: false, message: "This comment is not on this post" });
    }

    await commentModel.findOneAndUpdate(
      { _id: commentId },
      { $set: { isDeleted: true } }
    );

    validpost.comment = validpost.comment - 1;
    validpost.save();

    let updatedcomments = await commentModel.find({
      postId: postId,
      isDeleted: false,
    });

    return res.status(200).send({
      status: true,
      message: "comment deleted and post comment's updated successfully",
      data: updatedcomments,
    });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

const likeComment= async (req,res)=>{
try {
  let data = req.body
        let userId = req.params.user
        let postId= req.params.post
        let { commentId, action } = data

        // check userid
        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: " userId is not correct" })
        }

        const userCheck = await userModel.findOne({ userId: userId, isDeleted: false, isDeactivated: false })
        if (!userCheck) {
            return res.status(400).send({ status: false, message: `${userId} not exist` })
        }

        // check postId
       
        if (!isValidObjectId(postId)) {
            return res.status(400).send({ status: false, message: " invalid PostId ಥ_ಥ" })
        }
        const checkPostId = await postModel.findOne({ _id: postId, isDeleted: false })
        
        if (!checkPostId) {
            return res.status(400).send({ status: false, message: `post ${postId} is not present` })
        }
        if (!commentId) {
          return res.status(400).send({ status: false, message: "plz provide commentId" })
       }

        if (!isValidObjectId(commentId)) {
          return res.status(400).send({ status: false, message: " invalid commentId ಥ_ಥ" })
        }
        const checkComment = await commentModel.findOne({ postId: postId,_id:commentId ,isDeleted: false })
      
        if(!checkComment){
          return res.status(400).send({ status: false, message: ` comment ${commentId} is not present`})
        }



        // check event it can only like,dislike
        if (!action) {
            return res.status(400).send({ status: false, message: "provide action like or dislike " })
        }
        action = action.toString().trim().toLowerCase()
        if (!["like", "dislike"].includes(action)) {
            res.status(400).send({ status: false, message: "action can only be like  or dislike" })
        }

        //  check the presence of userId in likes

        let liked = checkComment["likedBy"].includes(userId)

        // *conditions---if like && !liked---push userId likes++
        if (action == "like" && !liked) {
            await commentModel.findByIdAndUpdate(commentId,
                {
                    $addToSet: { likedBy: userId },
                    $inc: { likes: 1 }
                },
                { new: true })

            res.status(200).send({ status: true, message: "succesfully ❤ the post (★‿★)" })
        }

        // 2] if likes&& liked --res already like want to unlike this post
        if (action == "like" && liked) {
            res.status(400).send({ status: false, message: "you have already liked the comment ¯\_(ツ)_/¯" })
        }
        // 3]if unlike&& !liked res--do you want to like the post
        if (action == "dislike" && !liked) {
            res.status(400).send({ status: false, message: " do you want to like ❤ this comment" })
        }
        // 4] if unlike&& liked pop (userId) like--
        if (action == "dislike" && liked) {
            await commentModel.findByIdAndUpdate(commentId,
                {
                    $pull: { likedBy: userId },
                    $inc: { likes: -1 }
                },
                { new: true })
                
            res.status(200).send({ status: true, message: "♨_♨  disliked the comment 🖤" })
        }
       
} catch (error) {
  return res.status(500).send({ status: false, message: err.message });
  
}
}


export { createComment, getComment, deleteComment, updatedcomment ,likeComment};


