const mongoose = require("mongoose");
const Cart = require("./cart");
const OwnedCourse = require("../models/ownedCourse").default;

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
    facilitator: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Facilitator",
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
  },
);


var autoPopulateLead = function(next) {
  this.populate('facilitator');
  next();
};

courseSchema.
  pre('findOne', autoPopulateLead).
  pre('find', autoPopulateLead);

// courseSchema.fill('students', function(callback){
//   // this.db.model('Course')
//   //     .find({parent: this.id})
//   //     .select('name age')
//   //     .order('-age')
//   //     .exec(callback);


//     const students = OwnedCourse
//       .find({course_id: this.id}).length.exec(callback)
//       console.log(students)

    
 

// })
const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
