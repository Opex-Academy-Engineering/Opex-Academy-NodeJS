const express = require("express");
const authAdmin = require("../middleware/authAdmin");
const router = new express.Router();
const {getPurchases,confirmPurchase} = require('../controllers/purchases');
const  auth  = require("../middleware/auth")


// Add item to cart
router.get("/purchases", authAdmin, getPurchases
);
// Add item to cart
router.post("/purchases", auth, confirmPurchase
);   


module.exports = router;
