const mongoose = require("mongoose");

const ownedCourseSchema = new mongoose.Schema(
  {
    course_id: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },

    owner:{ type: mongoose.Schema.Types.ObjectId, ref: "User" },

    progress: { type: Number, default: 0,min:0,max:100 },
    rating: { type: Number, default: 0,max:5,min:1 },
    comment: { type: String, default: "" },

  },
  {
    timestamps: true,
  }
);

const OwnedCourse = mongoose.model("OwnedCourse", ownedCourseSchema);

module.exports = OwnedCourse;
