
const express = require("express");
const router = express.Router();
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })

const auth = require("../middleware/auth");

const {registerNewUser,loginUser,logoutUser} = require('../controllers/user');




// Create user
router.post("/user/register",registerNewUser);

//Login user
router.post("/user/login",loginUser);

//Logout user 
router.delete("/user/logout",auth,logoutUser);



module.exports = router;