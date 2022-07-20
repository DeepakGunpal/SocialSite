const express = require('express');
const router = express.Router();

const { createUser, loginUser, getUser, updateUser, updatePassword, getRequests, acceptRequest,userDelete, following} = require('../controller.js/userController')
const {createPost}= require('../controller.js/postController')
const {createComment} = require('../controller.js/commentController')

//----------------------------------------------------FEATURE-1_USER API'S----------------------------------------------------------------------------------------//
router.post("/register", createUser)
router.post("/login", loginUser)
router.get("/user/:userId/profile", getUser)
router.put("/updateUser/:userId", updateUser)
router.put("/updatePsd/:userId", updatePassword)
router.get("/getRequests/:userId", getRequests)
router.put("/acceptRequest/:userId", acceptRequest)
router.delete('/deleteUser/:userId', userDelete)  // for delete user
router.put('/following/:userId', following)   // fpr update follower and following

//----------------------------------------------------FEATURE-2_POST API'S----------------------------------------------------------------------------------------//
router.post("/user/:userId/feed",createPost)
router.put("/editPost",)

// --------------------------- Comment API ------------------
router.post('/createComment/userId/postId', createComment)

module.exports = router;