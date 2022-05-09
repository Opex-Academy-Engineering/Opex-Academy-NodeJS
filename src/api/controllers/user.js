'use strict';
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;


const registerNewUser = async (req, res) => {
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
  };
  
  const loginUser = async (req, res, next) => {
    //
    const username = req.body.username;
    //
    const password = req.body.password;

    return res.status(200).send("Users");
  };

  const updateUser = async (req, res, next) => {

    return res.status(200).send("Users");
  };

  const returnUser = async (req, res, next) => {

    return res.status(200).send("Users");
  };

  module.exports = {
    registerNewUser,loginUser,updateUser,returnUser
  };
  