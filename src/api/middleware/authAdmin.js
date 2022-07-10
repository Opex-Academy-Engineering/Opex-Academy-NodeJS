const User = require("../../models/user");
const jwt = require("jsonwebtoken");
const {powers} = require('../../constants/roles');
require("dotenv").config();

const authAdmin = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findOne({ _id: payload._id });

    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE');
    res.setHeader('Access-Control-Allow-Methods','Content-Type','Authorization');
    console.log('we')
    if (!user) {
      throw new Error("User not found");
    }

    req.user = user;
    req.token = token;
    if (powers[user.role] >= 1) { 
      next();
    }else{
        res.status(403).json({
            "message":"Access denied",
            data:{}
        })
    }
  } catch (error) {
    res.status(400).json({ message: "Invalid Token or expired", data: error });
  }
};

module.exports = authAdmin;
