const express = require('express')
const router = express.Router();
const { createUser, updateUser, loginUser, updatePassword } = require('../controller.js/userController')

router.post("/register", createUser)
router.put("/updateUser/:userId", updateUser)
router.put("/updatePsd/:userId", updatePassword)
router.post("/login",loginUser)

module.exports = router;