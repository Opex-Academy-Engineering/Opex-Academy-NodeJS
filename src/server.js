

const express = require("express");
const app = express();
const config = require("../src/configs/index");
var bodyParser = require('body-parser')
const userRouter = require('../src/api/routes/user');
const courseRouter = require('../src/api/routes/course');
const cartRouter = require('../src/api/routes/cart');
const facilitatorRouter = require('../src/api/routes/facilitator');
const searchRouter = require('../src/api/routes/search');
const cors = require('cors');

const mongoose = require('mongoose');

 // keep this before all routes that will use pagination
// app.use(paginate.middleware(10, 50));
app.use(express.json());
app.use(bodyParser.json({ type: 'application/*+json' }));
app.use(cors());
app.use(express.urlencoded({ extended: true }));


app.use(userRouter);
app.use(cartRouter);
app.use(courseRouter);
app.use(searchRouter);
app.use(facilitatorRouter);



process.env.PORT = process.env.PORT || 3000;



    
async function main() {
  mongoose.Promise = global.Promise;

   mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,

  });


}
main().catch((err) => console.log(err));

app.listen(config.PORT, () => {
  console.log("Server running on " + config.PORT);
});

//Add this to the package.json should you have problems syncing it to the 
//heroku live server
// "engines": {
//   "node": ">=14",
//   "npm": "6.x"
// },