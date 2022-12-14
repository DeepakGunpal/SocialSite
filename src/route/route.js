import express from "express";
const router = express.Router();

import { createUser, loginUser, getUser, updateUser, updatePassword, getRequests, acceptRequest, userDelete, following } from '../controller.js/userController.js';
import { createPost, getPost, likePost, deletePosts } from '../controller.js/postController.js';
import { getComment, createComment, deleteComment, updatedcomment, likeComment } from '../controller.js/commentController.js'
import { auth, Authorization } from "../middleware/auth.js";

//----------------------------------------------------FEATURE-1_USER API'S----------------------------------------------------------------------------------------//
router.post("/register", createUser)
router.post("/login", loginUser)
router.get("/user/:userId/profiles", auth, Authorization, getUser)
router.put("/updateUser/:userId", auth, Authorization, updateUser)
router.put("/updatePsd/:userId", auth, Authorization, updatePassword)
router.get("/getRequests/:userId", auth, Authorization, getRequests)
router.put("/acceptRequest/:userId", auth, Authorization, acceptRequest)
router.delete('/deleteUser/:userId', auth, Authorization, userDelete)  // for delete user
router.put('/following/:userId', auth, Authorization, following)   // fpr update follower and following

//----------------------------------------------------FEATURE-2_POST API'S----------------------------------------------------------------------------------------//
router.get("/getPost/:userId", getPost)
router.post("/user/:userId/feed", createPost)
router.patch("/likePost/:userId", likePost)
router.delete("/delete/:userId/:postId", deletePosts)

//----------------------------------------------------FEATURE-3_COMMENT API'S----------------------------------------------------------------------------------------//
router.get("/getComment/:userId/post/:postId", getComment)
router.patch("/likeComment/:user/post/:post", likeComment)
router.post('/createComment/:userId/post/:postId', createComment)
router.delete("/deleteComment/:userId/post/:postId/comment/:commentId", deleteComment)
router.put("/updateComment/:userId/post/:postId/comment/:commentId", updatedcomment)

export default router;
