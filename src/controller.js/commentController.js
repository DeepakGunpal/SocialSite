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

export { createComment, getComment, deleteComment, updatedcomment };

// const updateProduct = async function (req, res) {
//     try {
//       let productId = req.params.productId;

//       if (!Validator.isValidObjectId(productId)) {
//         return res
//           .status(400)
//           .send({ status: false, message: " Enter a valid productId" });
//       }

//       const productByproductId = await productModel.findOne({
//         _id: productId,
//         isDeleted: false,
//       });

//       if (!productByproductId) {
//         return res
//           .status(404)
//           .send({ status: false, message: " Product not found" });
//       }
//       let data = req.body;
//       let {
//         title,
//         price,
//         currencyId,
//         currencyFormat,
//         availableSizes,
//         productImage,
//       } = data;

//       let files = req.files;

//       if (files && files.length > 0) {
//         if (!Validator.isValidImageType(files[0].mimetype)) {
//           return res.status(400).send({
//             status: false,
//             message: "Only images can be uploaded (jpeg/jpg/png)",
//           });
//         }
//         let fileUrl = await uploadFile(files[0]);
//         productImage = fileUrl;
//       }

//       if (title) {
//         let uniqueTitle = await productModel
//           .findOne({ title: title })
//           .collation({ locale: "en", strength: 2 });
//         if (uniqueTitle) {
//           return res.status(400).send({
//             status: false,
//             message: "Title already present",
//           });
//         }
//       }

//       if (price) {
//         if (!Validator.isValidPrice(price)) {
//           return res.status(400).send({
//             status: false,
//             message:
//               "Price should be minimum 3-5 digits and for decimal value- after decimal please take 2 digits",
//           });
//         }
//       }
//       if (currencyId) {
//         if (currencyId != "INR") {
//           return res.status(400).send({
//             status: false,
//             message: "CurrencyId should be INR",
//           });
//         }
//       }

//       if (currencyFormat) {
//         if (currencyFormat != "₹") {
//           return res.status(400).send({
//             status: false,
//             message: "CurrencyFormat should be ₹ ",
//           });
//         }
//       }

//       if (availableSizes) {
//         let enumSize = ["S", "XS", "M", "X", "L", "XXL", "XL"];
//         for (let i = 0; i < availableSizes.length; i++) {
//           if (!enumSize.includes(availableSizes[i])) {
//             return res.status(400).send({
//               status: false,
//               message: "availableSizes should be-[S, XS,M,X, L,XXL, XL]",
//             });
//           }
//         }
//       }

//       let updatedData = await productModel.findOneAndUpdate(
//         { _id: productId },
//         data,
//         {
//           new: true,
//         }
//       );
//       return res.status(200).send({
//         status: true,
//         message: "product details updated",
//         data: updatedData,
//       });
//     } catch (err) {
//       return res.status(500).send({ status: false, error: err.message });
//     }
//   };

// const updateReview = async function (req, res) {
//     try {
//       const { bookId, reviewId } = req.params;
//       if (!ObjectId.isValid(bookId)) {
//         return res
//           .status(400)
//           .send({ status: false, message: "Please enter valid bookId" });
//       }
//       if (!ObjectId.isValid(reviewId)) {
//         return res
//           .status(400)
//           .send({ status: false, message: "Please enter valid reviewId" });
//       }

//       let body = req.body;
//       const { rating } = body;

//       const validBook = await bookModel
//         .findOne({ _id: bookId, isDeleted: false })
//         .select({ deletedAt: 0 });

//       if (!validBook) {
//         return res.status(404).send({ status: false, message: "No book found" });
//       }

//       const validReviewId = await reviewModel.findOne({
//         _id: reviewId,
//         isDeleted: false,
//       });

//       if (!validReviewId) {
//         return res
//           .status(404)
//           .send({ status: false, message: "Review does not exist" });
//       }

//       if (bookId != validReviewId.bookId) {
//         return res
//           .status(400)
//           .send({ status: false, message: "This review is not for this book" });
//       }
//       if (!isValidRequestBody(body)) {
//         return res
//           .status(400)
//           .send({
//             status: false,
//             message: "Please provide data to update review",
//           });
//       }
//       if (!/(^[1-5]{1}\.[1-5]|^[1-5]{1}$)/.test(rating)) {
//         return res
//           .status(400)
//           .send({ status: false, message: "Rate between 1-5" });
//       }
//       body.reviewedAt = new Date();
//       let updatedReview = await reviewModel.findByIdAndUpdate(reviewId, body, {
//         new: true,
//       });
//       let getReviewsData = await reviewModel.find({
//         bookId: bookId,
//         isDeleted: false,
//       });
//       Object.assign(validBook._doc, { reviewsData: [getReviewsData] });
//       return res
//         .status(200)
//         .send({ status: true, message: "Review Updated", data: validBook });
//     } catch (err) {
//       return res.status(500).send({ status: false, message: err.message });
//     }
//   };
