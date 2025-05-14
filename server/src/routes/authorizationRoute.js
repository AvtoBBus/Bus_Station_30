const express = require("express");

const authorizationController = require("../controllers/authorizationController")

const authorizationRoute = express.Router();
authorizationRoute.get("/userinfo", authorizationController.userinfo);
authorizationRoute.post("/auth", authorizationController.auth);
authorizationRoute.post("/register", authorizationController.register);
authorizationRoute.get("/logout", authorizationController.logout);
authorizationRoute.get("/getUserActions", authorizationController.getUserActions);


module.exports = authorizationRoute;
