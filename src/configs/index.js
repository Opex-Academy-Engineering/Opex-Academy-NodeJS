const envFile = require('dotenv').config();

process.env.PORT = process.env.PORT || 3000;



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
