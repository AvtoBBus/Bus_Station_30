const express = require("express");

const usersActionsController = require("../controllers/usersActionsController");

const usersActionsRouter = express.Router();
usersActionsRouter.post("/userWantAdopt", usersActionsController.userWantAdopt);
usersActionsRouter.post("/userWantDonate", usersActionsController.userWantDonate);
usersActionsRouter.post("/userWantVolunteer", usersActionsController.userWantVolunteer);

module.exports = usersActionsRouter;