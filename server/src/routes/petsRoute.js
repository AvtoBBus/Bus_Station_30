const express = require("express");

const petsController = require("../controllers/petsController");

const petsRoute = express.Router();
petsRoute.use("/getPetsList", petsController.getPetsList);
petsRoute.use("/getPet", petsController.getPetById);


const imageController = require("../controllers/imageController");
petsRoute.use("/getPetImg", imageController.getPetsImg);

module.exports = petsRoute;