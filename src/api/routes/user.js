const express = require("express");
const router = express.Router();
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

const auth = require("../middleware/auth");

const {
  registerNewUser,
  loginUser,
  logoutUser,
  toggleNotifications,
  getKycInfo,
  changePassword,
  getAllUsers,
  getSpecificUser
} = require("../controllers/user");

// Create user
router.post("/user/register", registerNewUser);

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
