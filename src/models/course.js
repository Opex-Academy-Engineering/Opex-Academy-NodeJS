const mongoose = require("mongoose");
const Cart = require("./cart");
const mongoose_fuzzy_searching = require("mongoose-fuzzy-searching");

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
    price: {
      type: String,
      required: true,
      trim: true,
      default: "free",
    },
    ratings: {
      type: Number,
      default: 3,
      min: 1,
      max: 5,
    },
    course_header_image: {
      type: String,
      default: "",
    },
    tutor: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    tags: 
      {
        first_tag: String,
        second_tag: String,
      },
    
    content: [],
  },
  {
    timestamps: true,
  }
);

courseSchema.plugin(mongoose_fuzzy_searching, {
  fields: ["title",{ name: 'tags',
  keys: ['first_tag', 'second_tag'],}],
})
const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
