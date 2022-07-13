import  express  from "express";
const router = express.Router();

import { createUser, loginUser, getUser, updateUser, updatePassword, getRequests, acceptRequest,userDelete, following}  from '../controller.js/userController.js';
import {createPost,getPost} from '../controller.js/postController.js';

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
router.get("/getPost/:userId",getPost)
router.post("/user/:userId/feed",createPost)



export default router;