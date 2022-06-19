const express = require("express");
const auth = require("../middleware/auth.js");
const jwt = require("jsonwebtoken");
const Cart = require("../../models/cart");
const Course = require("../../models/course");
const { createConnection } = require("mongoose");
const router = new express.Router();
require("dotenv").config();

// Add item to cart
router.post("/cart", auth, async (req, res) => {
  try {
    const verify = jwt.verify(
      req.token,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, decoded) {
        if (err) {
          res
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

    res.status(201).json({
      messaage: "Course added successfully to cart.",
      data: cart,
    });
  } catch (e) {
    res.status(400).json({ message: "Failed to add course to cart", data: e });
  }
});

router.get("/cart", auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ owner: req.user._id });

    if (cart) {
      res.status(200).json({
        message: "Cart items loaded successfully",
        data: cart,
      });
    } else {
      res.status(400).json({
        message: "Retrieval of cart itens unsuccessful",
        data: cart,
      });
    }
  } catch (e) {
    res.status(400).json({
      message: "Retrieval of cart itens unsuccessful",
      data: e,
    });
  }
});

// Update a task by ID
router.patch("/tasks/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    // const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!task) {
      return res.status(404).send();
    }

    updates.forEach((update) => (task[update] = req.body[update]));
    await task.save();

    res.send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/cart", auth, async (req, res) => {

  try {
  
    const itemsToDelete = req.body.courses_id;

    var cart = await Cart.findOne({
        owner: req.user._id,
      });
    for (let i = 0; i<itemsToDelete.length;i++) {

 if(cart.items.includes(itemsToDelete[i])){
    const indexOfObject = cart.items.indexOf(itemsToDelete[i]);
    cart.items.splice(indexOfObject, 1);
 }
    }
    await cart.save();  
    res.status(200).json({
      message: "Course(s) successfully deleted.",
      data: cart,
    });
  } catch (e) {
    res.status(500).json({
      message: "Server error.",
      data: e,
    });
  }
});

module.exports = router;
