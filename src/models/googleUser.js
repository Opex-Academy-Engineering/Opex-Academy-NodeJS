const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const roles = require("../constants/roles");
require("dotenv").config();

// Schema for user
const googleUserSchema = new mongoose.Schema(
  {
    profile_pic: {
      type: String,
      default: "",
      trim: true,
      required: false,
    },
    name: {
      type: String,
      required: true,
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
    google_id: {
      type: String,
      required: true,
      default: "",
    },
    notifications: {
      type: Boolean,
      default: true,
      required: false,
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
googleUserSchema.methods.generateWebToken = async function () {
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
googleUserSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.tokens;

  return userObject;
};

// Hash password
googleUserSchema.pre("save", async function (next) {
  const user = this;
  next();
});

const GoogleUser = mongoose.model("GoogleUser", googleUserSchema);

module.exports = GoogleUser;
