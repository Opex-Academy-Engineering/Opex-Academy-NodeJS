'use strict';
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;


const registerNewUser = async (req, res, next) => {
    
    return res.status(200).send("Users");
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
  