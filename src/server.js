

const express = require("express");
const app = express();
const http = require('http');
const config = require("../src/configs/index");
var bodyParser = require('body-parser')
const userRouter = require('../src/api/routes/user');
const courseRouter = require('../src/api/routes/course');
const cartRouter = require('../src/api/routes/cart');
const promoteRouter = require('../src/api/routes/promote');
const envFile = require("dotenv").config();
const mongoose = require('mongoose');


app.use(express.json());
app.use(bodyParser.json({ type: 'application/*+json' }))

app.use(userRouter);
app.use(cartRouter);
app.use(courseRouter);
app.use(promoteRouter);



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
