const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      default: "",
    },
    description: {
      type: String,
      required: true,
      trim: true,
      default: "",
    },

    ratings: {
        type: Number,
        default:3,
        min: 1,
        max: 5,
      },
      course_header_image:{
        type:String,
        default:""
      },
    tutor: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    content:[]
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
