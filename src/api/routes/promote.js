const express = require("express");
const authSuperAdmin = require("../middleware/authSuperAdmin");
const jwt = require("jsonwebtoken");
const User = require("../../models/user");
const Course = require("../../models/course");
const { createConnection } = require("mongoose");
const router = new express.Router();
const {admin} = require('../../constants/roles');
require("dotenv").config();

// Add item to cart
router.put("/promote", authSuperAdmin, async (req, res) => {
  try{
    const user = await User.findById(req.body.user_id);
    user.role = admin;
    await user.save();
    res.status(200).json({
        "message":"User has been promoted to Admin",
        "data":user
    })
  }catch(e){
    res.status(500).json({
        "message":"Server error",
        "data":e
    })
  }
  }
);


module.exports = router;
