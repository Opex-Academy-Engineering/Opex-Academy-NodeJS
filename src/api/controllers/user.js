"use strict";
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../../models/user");

const auth = require("../middleware/auth");

const { addFile } = require("../utils/addFile");

const formidable = require("formidable");
const form = formidable({ multiples: true });

var bodyParser = require("body-parser");
const Cart = require("../../models/cart");
const Kyc = require("../../models/kyc");
const { response } = require("express");
var jsonParser = bodyParser.json();

/*
 *  -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR --
 */
const registerNewUser = async (req, res, next) => {
  form.parse(req, async (err, fields, files) => {
    try {
      const isEmailAvailable = await User.findOne({ email: fields.email });
      console.log(isEmailAvailable);
      if (!isEmailAvailable) {
        const user = new User({ ...fields });
        //upload profile_pic
        // await addFile(files);
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
        return response.status(400).json({
          message: "A User with this email already exist.",
          data: {},
        });
      }
    } catch (e) {
      return res.status(400).json({
        message: "Failed to create user",
        data: e.message,
      });
    }
  });
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
};
