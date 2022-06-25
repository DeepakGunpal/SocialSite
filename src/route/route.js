const express = require('express')
const router = express.Router();
const { createUser } = require('../controller.js/userController')

router.post("/register", createUser)

module.exports = router;