

const express = require("express");
const app = express();
const http = require('http');
const config = require("../src/configs/index");
const userRouter = require('../src/api/routes/user');

app.use(userRouter)

const server = http.createServer(app);

server.listen(config.PORT, () => {
  console.log("Server running on " + config.PORT);
});
