
const express = require("express");
const router = express.Router();
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()

const User = require("../../models/user");
const {registerNewUser,loginUser,logoutUser} = require('../controllers/user');


// Create user
router.post("/user/register",jsonParser,registerNewUser);

//Login user
router.post("/user/login",jsonParser,loginUser);

//Logout user 
router.delete("/user/logout",logoutUser);



module.exports = router;