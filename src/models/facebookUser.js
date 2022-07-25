const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const roles = require("../constants/roles");
const userTypes = require("../constants/userTypes");
require("dotenv").config();

// Schema for user
const facebookUserSchema = new mongoose.Schema(
  {
    profile_pic: {
      type: String,
      default: "",
      trim: true,
      required: false,
    },
    name: {
      type: String,
      required: false,
      default: "",
      trim: true,
    },
    email: {
      type: String,
      required: true,
      default: "",
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invaild.");
        }
      },
    },

    notifications: {
      type: Boolean,
      default: true,
      required: false,
    },
    user_type:{
      type: String,
      required:true,
      default:userTypes.defaultUser
    },
    role: {
      type: mongoose.Schema.Types.String,
      required: true,
      default: roles.student,
    },
    kyc: { type: mongoose.Schema.Types.ObjectId, ref: "KYC" },
    tokens: [
      {
        token: {
          required: true,
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Web token generator method
facebookUserSchema.methods.generateWebToken = async function () {
  const user = this;
  const token = jwt.sign(
    { _id: user._id.toString() },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "7 days" }
  );

  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

// Produces public data sent to user
facebookUserSchema.methods.toJSON = function () {
  const userObject = this.toObject();

  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};


const FacebookUser = mongoose.model("FacebookUser", facebookUserSchema);

module.exports = FacebookUser;
