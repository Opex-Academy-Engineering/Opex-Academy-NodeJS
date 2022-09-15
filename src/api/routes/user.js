const express = require("express");
const router = express.Router();
var bodyParser = require("body-parser");

const auth = require("../middleware/auth");

const multer  = require('multer')
const storage = multer.memoryStorage();
const upload = require('../utils/upload')

const {
  registerNewUser,
  loginUser,
  logoutUser,
  toggleNotifications,
  getKycInfo,
  changePassword,
  getAllUsers,
  getSpecificUser,
  verifyCode,
  sendCode,
  registerOrLoginWithGoogle,
  checkTokenValidity,updateUser
} = require("../controllers/user");



// Create user
router.post("/user/register",upload.single('profile_pic'),registerNewUser);

//Check token validity
router.post("/user/token-validity",auth,checkTokenValidity);

// send code
router.post("/user/send-code", sendCode);

// Update user info
router.patch("/user", auth ,updateUser);

// Verify code
router.post("/user/verify", verifyCode);

//Login user
router.post("/user/login", loginUser);

//User notifications setting
router.post("/user/notifications", auth, toggleNotifications);

//User kyc setting
router.get("/user/kyc", auth, getKycInfo);

//Get all users
router.get("/users", auth, getAllUsers);

//Get a specific user
router.get("/user", auth, getSpecificUser);

//User change password setting
router.patch("/user/change-password", auth, changePassword);

//Logout user
router.delete("/user/logout", auth, logoutUser);

module.exports = router;
