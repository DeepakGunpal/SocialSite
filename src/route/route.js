const express = require('express')
const router = express.Router();
const { createUser } = require('../controller.js/userController')

router.post("/createUser", createUser)

module.exports = router;