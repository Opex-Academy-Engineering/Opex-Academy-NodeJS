

const express = require("express")
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const paginate = require('express-paginate')
const userRouter =require( '../src/api/routes/user')
const courseRouter = require('../src/api/routes/course')
const cartRouter = require('../src/api/routes/cart')
const promoteRouter = require('../src/api/routes/promote')
const searchRouter = require('../src/api/routes/search')
const uploadRouter = require('../src/api/routes/upload')



 // keep this before all routes that will use pagination
app.use(paginate.middleware(10, 50));
app.use(express.json());
app.use(bodyParser.json({ type: 'application/*+json' }));
app.use(cors());
app.use(express.urlencoded({ extended: false }));




app.use(userRouter);
app.use(cartRouter);
app.use(courseRouter);
app.use(searchRouter);
app.use(promoteRouter);
app.use(uploadRouter);



process.env.PORT = process.env.PORT || 3000;
    
async function main() {
  mongoose.Promise = global.Promise;
   mongoose.connect("mongodb+srv://Thesiyynndicate:BSPPwdq%238G-DxYa@cluster0.bz5c7.mongodb.net/test", {
    useNewUrlParser: true,
    useUnifiedTopology: true,

  });
}
main().catch((err) => console.log(err));

app.listen(process.env.PORT, () => {
  console.log("Server running on " + process.env.PORT);
});
