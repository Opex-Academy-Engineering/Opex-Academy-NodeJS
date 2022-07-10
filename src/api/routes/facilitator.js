const express = require("express");
const router = express.Router();
var bodyParser = require("body-parser");
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

const auth = require("../middleware/auth");

const accountSid = 'ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'; // Your Account SID from www.twilio.com/console
const authToken = 'your_auth_token'; // Your Auth Token from www.twilio.com/console

// const multer = require("multer");
// const upload = multer({ dest: "uploads/" });

const {
  registerNewFacilitator,
  getAllFacilitators,
  deleteFacilitators,
  toggleFacilitatorStatus,
  getFacilitatorInfo
} = require("../controllers/facilitator");

// Create facilitator
router.post("/facilitator/register",upload.single("profile_pic") ,registerNewFacilitator);


//Toggle Facilitator activity status
router.post("/facilitator", auth, toggleFacilitatorStatus);

// //User kyc setting
// router.get("/user/kyc", auth, getKycInfo);

//Get all facilitators
router.get("/facilitators", getAllFacilitators);

//Get all facilitators
router.get("/facilitator/info", getFacilitatorInfo);

// //Get a specific user
// router.get("/user", auth, getSpecificUser);

// //User change password setting
// router.patch("/user/change-password", auth, changePassword);

//Delete facilitator
router.delete("/facilitator", auth, deleteFacilitators);

module.exports = router;
