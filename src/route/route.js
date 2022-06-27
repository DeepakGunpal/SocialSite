const express = require('express')
const router = express.Router();
const { createUser, updateUser } = require('../controller.js/userController')

router.post("/register", createUser)
router.put("/updateUser/:userId", updateUser)


module.exports = router;