const express = require("express");

const petsController = require("../controllers/petsController");
const multer = require("multer");

const petsRoute = express.Router();
petsRoute.use("/getPetsList", petsController.getPetsList);
petsRoute.use("/getPet", petsController.getPetById);

var diskStorage = new multer.diskStorage({
    destination: (req, file, callback) => {
        const animalType = new URLSearchParams(req.query).get("animalType");
        if (animalType !== "cat" && animalType !== "dog") {
            callback(null, './assets/unknow');
        }
        else callback(null, `./assets/${animalType}s`);
    },
    filename: (req, file, callback) => {
        callback(null, Date.now() + "_" + Math.random() + "_" + file.originalname)
    }
});

var uploadImg = multer({ storage: diskStorage });
petsRoute.post("/addNewAnimal", uploadImg.single("file"), petsController.addNewAnimal)


const imageController = require("../controllers/imageController");
petsRoute.use("/getPetImg", imageController.getPetsImg);

module.exports = petsRoute;