const envFile = require("dotenv").config();
const mongoose = require("mongoose");



if (envFile.error) {
  throw new Error("env file not found");
}

module.exports = {
  HOSTNAME: process.env.HOSTNAME,
  PORT: parseInt(process.env.PORT) || 3000,
  DB: {
    URL: process.env.DB_URL,
    NAME: process.env.DB_NAME,
  },
  API_PREFIX: process.env.API_PREFIX || "api",
};
