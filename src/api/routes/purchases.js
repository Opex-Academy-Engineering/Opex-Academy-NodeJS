const express = require("express");
const authAdmin = require("../middleware/authAdmin");
const router = new express.Router();
const {getPurchases} = require('../controllers/purchases');


// Add item to cart
router.get("/purchases", authAdmin, getPurchases
);


module.exports = router;
