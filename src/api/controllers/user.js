'use strict';
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../../models/user');

const auth = require("../middleware/auth");

const formidable = require('formidable');
const form = formidable({ multiples: true });

var bodyParser = require('body-parser');
const Cart = require('../../models/cart');
var jsonParser = bodyParser.json()



/*
*  -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- 
*/
const registerNewUser = (async (req, res,next) => {



  form.parse(req, async (err, fields, files) =>  {
  try {

    const user = new User({...fields});
    const token = await user.generateWebToken();
    const cart = new Cart({owner: user._id});
cart.save();

      // const token = await user.generateWebToken();

      // Sends the user and the generated token only
      res.status(201).json({
        message: "User created successfully",
        data: {
          user: user,
          token: token,
        },
      });
    } catch (e) {

      res.status(400).send(e);
    }
  });


  }
  );
  

/*
*  -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- 
*/
  const loginUser = async (req, res,next) => {
    form.parse(req, async (err, fields, files) =>  {
    try {
            const user = await User.findByCredentials(
              fields.email,
              fields.password
            );
            const token = await user.generateWebToken();
            res.json({
              message: "Logged in successfully",
              data: {
                user: user,
                token: token,
              },
            });
          } catch (error) {
            res.status(400).json({
              message: "Failed to login",
              data: error,
            });
          }})
  }


/*
*  -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- 
*/  
  const logoutUser = async (req, res) =>  {

    try {
      req.user.tokens = req.user.tokens.filter((tokenObj) => {
    
        return tokenObj.token !== req.token;
    
      });
      await req.user.save();

      res.status(200).
        json({
          message: "Logged out successfully!",
          data: {},
        })
      ;
    } catch (error) {
      res.status(417).json({
        message:"Log out unsuccessful. The expectation given could not be met by this server.",
        data:error
      });
    }
    
  }
  
/*
*  -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- 
*/ 
  const updateUser = async (req, res, next) => {

    return res.status(200).send("Users");
  };

  const returnUser = async (req, res, next) => {

    return res.status(200).send("Users");
  };
/*
*  -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- 
*/ 
  module.exports = {
    registerNewUser,loginUser,updateUser,returnUser,logoutUser
  };
  