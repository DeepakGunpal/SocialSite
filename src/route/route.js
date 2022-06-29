const express = require('express')
const router = express.Router();
const { createUser,loginUser,getUser} = require('../controller.js/userController')


//----------------------------------------------------FEATURE-1_USER API'S----------------------------------------------------------------------------------------//
router.post("/register", createUser)
router.post("/login", loginUser)
router.get("/user/:userId/profile", getUser)


module.exports = router;