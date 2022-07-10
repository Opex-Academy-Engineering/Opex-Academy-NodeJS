//facilitator

// const mongoose = require("mongoose");
const mongoose = require('mongoose');
 const   Schema = mongoose.Schema;

const facilitatorSchema = new Schema(
  {
    facilitator_id:{
        type:String,
default:"0000",


    },
    profile_pic:{
        type:String,
        default:"",
    },
    name: {
      type: String,
      required: true,
      trim: true,
      default: "",
    },
    email: {
      type: String,
      required: true,
      trim: true,
      default: "",
    },
    phone_no: {
      type: String,
      required: true,
      trim: true,
      default: "",
    },
    status:{
        type:String,
        default:'ACTIVE'
    },
    courses_facilitated: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    speciality: {
      type: String,
      default: "",
    },

    content: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject",
      },
    ],
  },
  {
    timestamps: true,


  }
);


const Facilitator = mongoose.model("Facilitator", facilitatorSchema);

function padNumber(number) {
  number = number.toString();

  while (number.length < 4) {
    number = "0" + number;
  }

  return number;
}

// facilitatorSchema.pre("save", async function (next) {
//   try {

//     const facilitator = this;


//     // facilitator._id = (0001 +parseInt( lastFacilitator[0]._id.toString())).toString()

//     next();
//   } catch (error) {
//     throw new Error("Unable to add facilitator");
//   }
// });

module.exports = Facilitator;
