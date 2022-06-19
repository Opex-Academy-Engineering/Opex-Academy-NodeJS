const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    items:[
      { type: mongoose.Schema.Types.ObjectId, ref: "Course" }
    ],


    owner: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
