const express = require("express");
const router = express.Router();
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

const auth = require("../middleware/auth");

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const {
  registerNewUser,
  loginUser,
  logoutUser,
  toggleNotifications,
  getKycInfo,
  changePassword,
  getAllUsers,
  getSpecificUser,
  verifyCode
} = require("../controllers/user");



// Create user
router.post("/user/register",registerNewUser);
// Verify code
router.post("/user/verify", verifyCode

);

//Login user
router.post("/user/login", loginUser);

//TEST user
router.post("/user/sms",  async (req, res) => {
  try {
    client.messages
    .create({
      body: 'Hello from Node',
      to: '+2348088889186', // Text this number
      from: '+2348036183400', // From a valid Twilio number
    })
    .then((message) => {
      console.log(message.sid);
      return res.status(200).json({"message": "Message sent"})
    });
  } catch (error) {
    return res.status(400).json({
      message: "Failed to login",
      data: error.message,
    });
  }
});

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
