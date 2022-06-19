const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const roles = require("../constants/roles")
require("dotenv").config();

// Schema for user
const userSchema = new mongoose.Schema(
  {
    profile_pic: {
      type: String,
      default: "",
      trim: true,
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
    password: {
      type: String,
      required: true,
      default: "",
      validate(value) {
        if (value.toLowerCase().includes("password")) {
          throw new Error("Password can't be your password.");
        }
      },
      minlength: 7,
      trim: true,
    },
    phone_no: {
      type: String,
      required: true,
      default: "",
    },
    notifications: {
      type: Boolean,
      default: true,
    },

    role: {
      type: mongoose.Schema.Types.String,
      required: true,
      default: roles.student,
    },kyc:{ type: mongoose.Schema.Types.ObjectId, ref: "KYC" },
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
userSchema.methods.generateWebToken = async function () {
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
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();

  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};

// Find user by email and password
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Unable to login!");
  }

  const isCorrect = await bcrypt.compare(password, user.password);

  if (!isCorrect) {
    throw new Error("Unable to login!");
  }

  return user;
};

// Hash password
userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
