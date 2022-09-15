const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema(
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
    thumbnail: {
      type: String,
      required: true,
      trim: true,
      default: "",
    },
    media_upload: {
      type: String,
      default: "",

    },
    course_id:  { 
      type: mongoose.Schema.Types.ObjectId,
       ref: "Course" 
      },
    
  },
  {
    timestamps: true,
  },
);


const Lesson = mongoose.model("Lesson", lessonSchema);

module.exports = Lesson;
