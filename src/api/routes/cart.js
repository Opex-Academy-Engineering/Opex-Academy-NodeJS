const express = require("express");
const auth = require("../middleware/auth.js");
const jwt = require("jsonwebtoken");
const Cart = require("../../models/cart");
const Course = require("../../models/course");
const {addToCart,retreiveUserCart,removeItemFromCart} = require('../controllers/cart')
const { createConnection } = require("mongoose");
const router = new express.Router();
require("dotenv").config();

// Add item to cart
router.post("/cart", auth, addToCart);

// Get a course into the cart
router.get("/cart", auth,retreiveUserCart);

// remove an item from the cart
router.delete("/cart", auth, removeItemFromCart);

module.exports = router;
