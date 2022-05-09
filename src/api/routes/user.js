
const express = require("express");
const router = express.Router();
const User = require("../../models/user");
const {registerNewUser} = require('../controllers/user');


// Create user
router.post("/user/create",registerNewUser);

module.exports = router;