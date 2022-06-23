const express =require("express");
const userRouter = express.Router();
const auth =require("../middleware/auth")
const multer = require('multer')
const upload = multer({
  storage: multer.memoryStorage()
})


const {
  registerNewUser,
  loginUser,
  logoutUser,
  toggleNotifications,
  getKycInfo,
  changePassword,
  getAllUsers,
  getSpecificUser
} = require("../controllers/user")

// Create user
userRouter.post("/user/register", registerNewUser);

//Login user
userRouter.post("/user/login", loginUser);

//User notifications setting
userRouter.post("/user/notifications", auth, toggleNotifications);

//User kyc setting
userRouter.get("/user/kyc", auth, getKycInfo);

//Get all users
userRouter.get("/users", auth, getAllUsers);

//Get a specific user
userRouter.get("/user", auth, getSpecificUser);

//User change password setting
userRouter.patch("/user/change-password", auth, changePassword);

//Logout user
userRouter.delete("/user/logout", auth, logoutUser);

module.exports = userRouter;
