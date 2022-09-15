"use strict";
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../../models/user");
const Course = require("../../models/course");

const auth = require("../middleware/auth");
const Cart = require("../../models/cart");


var bodyParser = require("body-parser");
const e = require("express");
var jsonParser = bodyParser.json();

/*
 *  -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR --
 */
const addToCart = async (req, res) => {
  try {

    const user = req.user;

    const course = await Course.findById(req.body.course_id)

    const cart = await Cart.findOne({ owner: req.user._id }).populate('items');

   if(course){ 
    for(var i in cart.items)
    console.log(cart.items[i]._id)
    if (cart.items[i]._id===course._id) {
      return res.status(200).json({
        messaage: "The Course is already in the cart.",
        data: cart,
      });
    } else {
      cart.items.push(course);

      await cart.save();
    }

    return res.status(200).json({
      messaage: "Course added successfully to cart.",
      data: cart,
    });}else{
      return res.status(400).json({
        messaage: "The Course was not found.",
        data: cart,
      });
    }
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
    const cart = await Cart.findOne({ owner: req.user._id }).populate('items');

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
    }).populate('items');
    for (var x in itemsToDelete)  {
      for (var i in cart.items) 
      if (cart.items[i]._id === itemsToDelete[x]) 
      console.log(i)
      console.log(cart.items[i])

        var indexOfObject = cart.items.indexOf(itemsToDelete[x]);
        cart.items.splice(indexOfObject, 1);
    
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
