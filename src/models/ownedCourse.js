const mongoose = require("mongoose");

const ownedCourseSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course",required:true },

    owner:{ type: mongoose.Schema.Types.ObjectId, ref: "User",required:true },

    progress: { type: Number, default: 0 },
    rating: { type: Number, default: 0},
    comment: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

const OwnedCourse = mongoose.model("OwnedCourse", ownedCourseSchema);

module.exports =  OwnedCourse;
