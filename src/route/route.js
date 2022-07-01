const express = require('express')
const router = express.Router();
const { createUser,loginUser,userDelete, following } = require('../controller.js/userController')

router.post("/register", createUser)
router.post("/login",loginUser)

router.delete('/deleteUser', userDelete )
router.put('/following', following)

module.exports = router;