const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const roles = require("../constants/roles");
require("dotenv").config();

// Schema for user
const subjectSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      default: "",
      trim: true,
      required: true,
    },
    course_id: {
      type: String,
      required: true,
      default: "",
      trim: true,
    },
    order: {
      type: Number,
      required: true,
      default: 0,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
       if(isNaN(value)){
        throw new Error("Order must be a number");
       }
      },
    },
  },
  {
    timestamps: true,
  }
);

// subjectSchema.pre("save", async function (next) {
//   next();
// });

const Subject = mongoose.model("Subject",subjectSchema);

module.exports = Subject;
