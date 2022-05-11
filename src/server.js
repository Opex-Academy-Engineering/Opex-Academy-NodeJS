

const express = require("express");
const app = express();
const http = require('http');
const config = require("../src/configs/index");
var bodyParser = require('body-parser')
const userRouter = require('../src/api/routes/user');
const envFile = require("dotenv").config();
const mongoose = require('mongoose');

app.use(userRouter);
app.use(bodyParser.json());
app.use(express.json());


process.env.PORT = process.env.PORT || 3000;

async function main() {
  await mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}
main().catch((err) => console.log(err));

app.listen(config.PORT, () => {
  console.log("Server running on " + config.PORT);
});
