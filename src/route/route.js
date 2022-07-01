const express = require('express')
const router = express.Router();
const { createUser, loginUser, getUser, updateUser, updatePassword, getRequests, acceptRequest } = require('../controller.js/userController')


//----------------------------------------------------FEATURE-1_USER API'S----------------------------------------------------------------------------------------//
router.post("/register", createUser)
router.post("/login", loginUser)
router.get("/user/:userId/profile", getUser)
router.put("/updateUser/:userId", updateUser)
router.put("/updatePsd/:userId", updatePassword)
router.get("/getRequests/:userId", getRequests)
router.put("/acceptRequest/:userId", acceptRequest)

//----------------------------------------------------FEATURE-2_POST API'S----------------------------------------------------------------------------------------//
router.put("/editPost",)

module.exports = router;