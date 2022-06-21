const express = require("express");
const auth = require("../middleware/auth.js");
const {getSearchResults}  = require('../controllers/search')
const router = new express.Router();


// Add item to cart
router.get("/search", auth, getSearchResults);

module.exports = router;
