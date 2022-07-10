"use strict";
const bcrypt = require("bcrypt");
const User = require('../../models/user')

const { v4: uuidv4 } = require('uuid');

const Cart = require("../../models/cart");
const Kyc = require("../../models/kyc");
const { response } = require("express");

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const { getApp } = require("firebase/app");
const {app} = require('../../configs/firebase')
const {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} = require("firebase/storage");
const { constants } = require("buffer");



const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);


async function uploadDataToFireBaseStorage(data){
 //
 const firebaseApp = getApp();
 const storage = getStorage(
   firebaseApp,
   "gs://opex-academy-mobile.appspot.com"
 );

 await uploadBytes(imagesRef, img);

 const uploadedDataUrl = await getDownloadURL(imagesRef, img)

 return uploadedDataUrl;
}
/*
 *  -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR --
 */
const registerNewUser = async (req, res) => {

  try {
    // const file = req.file;
    // var img = require("fs").readFileSync(file.path);


    // const uid = uuidv4();

    // //
    // const imagesRef = ref(storage, `images/${uid}.jpg`);

    const isEmailAvailable = await User.findOne({ email: req.body.email });
    if (!isEmailAvailable) {
      const user = await new User({ email:req.body.email,
      phone_no:req.body.phone_no,
      password:req.body.password,
      name:req.body.name
      });
      console.log(user)

      const token = await user.generateWebToken();
      const cart = new Cart({ owner: user._id });
      const kyc = new Kyc({ owner: user._id });
      user.kyc = kyc;
      await user.save();
      await cart.save();
      await kyc.save();

      // Sends the user and the generated token only

      return res.status(201).json({
        message: "User created successfully",
        data: {
          user: user,
          token: token,
        },
      });
    } else {
      return res.status(400).json({
        message: "A User with this email already exist.",
        data: {},
      });
    }
  } catch (e) {
    return res.status(500).json({
      message: "Failed to create user",
      data: e.message,
    });
  }
};

/*
 *  -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR --
 */
const getSpecificUser = async (req, res) => {
  try {
    const user = await User.findById(req.query.user_id);

    return res.status(200).json({
      message: `${user.name}'s profile`,
      data: {
        user: user,
      },
    });
  } catch (error) {
    return res.status(400).json({
      message: "Failed to retreive user",
      data: error.message,
    });
  }
};
/*
 *  -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR --
 */
const sendCode = async (req, res) => {
  try {
    const verificationCheck = await client.verify.v2.services(process.env.TWILIO_SERVICE_ID)
      .verifications
      .create({to: req.body.phone_no, channel: 'sms', amount:'', payee:'',})


      return res.status(200).json({
        "message":`SMS sent successfully to ${req.body.phone_no}`,
        "data": verificationCheck
      })

  } catch (error) {
    return res.status(400).json({
      message: `Failed to send text to ${req.body.phone_no}`,
      data: error.message,
    });
  }
};
/*
 *  -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR --
 */
const verifyCode = async (req, res) => {
  try {
 

    const verificationCheck = await client.verify.services(process.env.TWILIO_SERVICE_ID)
      .verificationChecks
      .create({to: req.body.phone_no, channel: 'sms', amount:'', payee:'', code:req.body.code});

      return res.status(200).json({
        "message":"User verified",
        "data": verificationCheck
      })

  } catch (error) {
    return res.status(400).json({
      message: "Failed to verify user",
      data: error.message,
    });
  }
};

/*
 *  -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR --
 */
const loginUser = async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateWebToken();

    return res.status(200).json({
      message: "Logged in successfully",
      data: {
        user: user,
        token: token,
      },
    });
  } catch (error) {
    return res.status(400).json({
      message: "Failed to login",
      data: error.message,
    });
  }
};

/*
 *  -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR --
 */
const logoutUser = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((tokenObj) => {
      return tokenObj.token !== req.token;
    });
    await req.user.save();

    return res.status(200).json({
      message: "Logged out successfully!",
      data: {},
    });
  } catch (error) {
    return res.status(417).json({
      message:
        "Log out unsuccessful. The expectation given could not be met by this server.",
      data: error,
    });
  }
};

/*
 *  -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR --
 */
const updateUser = async (req, res, next) => {
  return res.status(200).send("Users");
};
/*
 *  -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR --
 */
const getKycInfo = async (req, res, next) => {
  try {
    const kycInfo = await Kyc.findOne({ owner: req.user._id });
    return res.status(200).json({
      message: "Kyc info loaded.",
      data: kycInfo,
    });
  } catch (e) {
    return res.status(500).json({
      message: "Server error",
      data: e,
    });
  }
};
/*
 *  -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR --
 */
const toggleNotifications = async (req, res, next) => {
  console.log("user");
  try {
    const user = await User.findById(req.user._id);

    user.notifications = !req.user.notifications;
    await user.save();

    return res.status(200).json({
      message: `Notifications turned ${req.user.notifications ? "off" : "on"}.`,
      data: user,
    });
  } catch (e) {
    return res.status(500).json({
      message: "Server error.",
      data: e,
    });
  }
};
/*
 *  -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR --
 */
const changePassword = async (req, res, next) => {
  try {
    const user = req.user;
    const isCorrect = await bcrypt.compare(
      req.body.old_password,
      user.password
    );
    if (isCorrect) {
      user.password = req.body.new_password;
      await user.save();
      return res.status(200).json({
        message: "Password successfully changed.",
        data: user,
      });
    } else {
      return res.status(403).json({
        message: "The old password was incorrect.",
        data: {},
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Server error.",
      data: error,
    });
  }
};
/*
 *  -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR --
 */
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    if (users) {
      res.status(200).json({
        message: "All Users from the database.",
        data: users,
      });
    } else {
      res.status(204).json({
        message: "No content",
        data: error.message,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      data: error.message,
    });
  }
};
/*
 *  -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR --
 */
const sendVerificationCodeToUser = async (req, res, next) => {
  try {
    const sendVerificationCode =await client.verify.services(process.env.TWILIO_SERVICE_ID)
    .verifications
    .create({to: req.body.phone_no, channel: 'sms', amount:'', payee:''});


    if (sendVerificationCode) {
      res.status(200).json({
        message: "Verification code sent successfully",
        data: users,
      });
    } else {
      res.status(204).json({
        message: "No content",
        data: error.message,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      data: error.message,
    });
  }
};
/*
 *  -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR --
 */
const returnUser = async (req, res, next) => {
  return res.status(200).send("Users");
};
/*
 *  -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR --
 */
module.exports = {
  registerNewUser,
  loginUser,
  updateUser,
  returnUser,
  logoutUser,
  toggleNotifications,
  getKycInfo,
  changePassword,
  getAllUsers,
  getSpecificUser,
  verifyCode,
  sendCode
};
