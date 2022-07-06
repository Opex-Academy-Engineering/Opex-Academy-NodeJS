"use strict";
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../../models/user");

const auth = require("../middleware/auth");
const Cart = require("../../models/cart");


var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();

/*
 *  -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR --
 */
const addToCart = async (req, res) => {
  try {
    const verify = jwt.verify(
      req.token,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, decoded) {
        if (err) {
          return res
            .status(400)
            .json({ message: "Failed to add course to cart", data: err });
        }
      }
    );
    const user = req.user;

    const course = await Course.findById(req.body.course_id);

    const cart = await Cart.findOne({ owner: req.user._id });
    if (cart.items.includes(course._id)) {
      res.status(200).json({
        messaage: "The Course is already in the cart.",
        data: cart,
      });
    } else {
      cart.items.push(course);

      cart.save();
    }

    return res.status(200).json({
      messaage: "Course added successfully to cart.",
      data: cart,
    });
  } catch (e) {
    return res
      .status(400)
      .json({ message: "Failed to add course to cart", data: e.messaage });
  }
};
/*
 *  -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR --
 */

const retreiveUserCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ owner: req.user._id });

    if (cart) {
      return res.status(200).json({
        message: "Cart items loaded successfully",
        data: cart,
      });
    } else {
      return res.status(500).json({
        message: "Retrieval of cart items unsuccessful",
        data: cart,
      });
    }
  } catch (e) {
    return res.status(500).json({
      message: "Retrieval of cart items unsuccessful",
      data: e.messaage,
    });
  }
};
/*
 *  -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR --
 */

const removeItemFromCart = async (req, res) => {
  try {
    const itemsToDelete = req.body.courses_id;

    var cart = await Cart.findOne({
      owner: req.user._id,
    });
    for (let i = 0; i < itemsToDelete.length; i++) {
      if (cart.items.includes(itemsToDelete[i])) {
        const indexOfObject = cart.items.indexOf(itemsToDelete[i]);
        cart.items.splice(indexOfObject, 1);
      }
    }
    await cart.save();
    return res.status(200).json({
      message: "Course(s) successfully deleted.",
      data: cart,
    });
  } catch (e) {
    return res.status(500).json({
      message: "Server error.",
      data: e.messaage,
    });
  }
};
module.exports = {
  addToCart,
  retreiveUserCart,
  removeItemFromCart,
};
