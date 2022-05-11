'use strict';
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../../models/user');
const saltRounds = 10;
var bodyParser = require('body-parser')
const auth = require("../middleware/auth");

// create application/json parser
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

/*
*  -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- 
*/
const registerNewUser = (async (req, res) => {

    //user, token
    try {
      const user = new User(req.body);
      const token = await user.generateWebToken();
  
      // Sends the user and the generated token only
      res.status(201).json({
        message: "User created successfully",
        data: {
          user: user,
          token: token,
        },
      });
    } catch (e) {
      res.status(400).json({
          message:"An error occured",
          data:e
      });
    }
  });
  

/*
*  -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- 
*/
  const loginUser = (async (req, res) => {
    try {
      const user = await User.findByCredentials(
        req.body.email,
        req.body.password
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
        data: { error },
      });
    }
  });


/*
*  -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- 
*/  
  const logoutUser = (auth, async (req, res) => {
    if(req.method == "DELETE"){
      try {
        req.user.tokens = req.user.tokens.filter((tokenObj) => {
          return tokenObj.token !== req.token;
        });
        await req.user.save();
        res.status(200).send(
          json({
            message: "Logged out successfully!",
            data: {},
          })
        );
      } catch (error) {
        res.status(417).json({
          message:"Log out unsuccessful. The expectation given could not be met by this server.",
          data:error
        });
      }
    }else{
    res.status(500).json(
      {
        message:"The header method is not allowed for this route.",
        data:{}
      }
    );
    }
  });

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
  