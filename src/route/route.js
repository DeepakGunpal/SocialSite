const express = require('express')
const router = express.Router();
const { createUser, updateUser, loginUser } = require('../controller.js/userController')

router.post("/register", createUser)
router.put("/updateUser/:userId", updateUser)
router.post("/login",loginUser)

module.exports = router;