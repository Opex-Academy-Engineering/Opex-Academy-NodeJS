const express = require("express");
const authSuperAdmin = require("../middleware/authSuperAdmin");
const router = new express.Router();
const {promoteToAdmin} = require('../controllers/promote');
require("dotenv").config();

// Add item to cart
router.put("/promote", authSuperAdmin, promoteToAdmin
);


module.exports = router;
