const express = require("express");

const userController = require("../controllers/userController")

const userRoute = express.Router();
userRoute.get("/userinfo", userController.userinfo);
userRoute.post("/auth", userController.auth);
userRoute.post("/register", userController.register);
userRoute.get("/logout", userController.logout);
userRoute.get("/getUserActions", userController.getUserActions);
userRoute.post("/updateActionStatus", userController.updateActionStatus);
userRoute.post("/updateUserInfo", userController.updateUserInfo)


module.exports = userRoute;
