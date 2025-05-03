const express = require("express");

const authorizationController = require("../controllers/authorizationController")

const authorizationRoute = express.Router();
authorizationRoute.get("/userinfo", authorizationController.userinfo);
authorizationRoute.post("/auth", authorizationController.auth);
authorizationRoute.get("/logout", authorizationController.logout);


module.exports = authorizationRoute;
