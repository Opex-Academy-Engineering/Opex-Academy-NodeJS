const mongoose = require("mongoose");

const ownedCourseSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },

    owner:{ type: mongoose.Schema.Types.ObjectId, ref: "User" },

    progress: { type: String, default: "" },
    rating: { type: String, default: "" },
    comment: { type: String, default: "" },

  },
  {
    timestamps: true,
  }
);

const OwnedCourse = mongoose.model("KYC", ownedCourseSchema);

module.exports = OwnedCourse;
