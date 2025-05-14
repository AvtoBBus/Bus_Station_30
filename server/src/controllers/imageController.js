const { ObjectId } = require("mongodb");
const { getPetImgModel } = require("../models/getPetImgModel");
const fs = require('fs');
const path = require("node:path");

const connectionString = process.env.DB_CONNECTION_STRING;

exports.getPetsImg = async function (request, response) {
    const petId = new URLSearchParams(request.query).get("id");
    if (!petId) {
        response.status(404).send("input id");
        return
    }

    const MongoClient = require("mongodb").MongoClient;
    const client = new MongoClient(connectionString);

    await client.connect();
    const db = client.db("pets");
    const collection = db.collection("petsCollection");
    const image = await collection.find({ "_id": new ObjectId(petId) }).project(getPetImgModel).toArray();


    if (!image || image.length === 0) response.status(404).send("Img not found");
    else {
        const imgPath = image[0].img;
        const filePath = path.resolve(imgPath.startsWith("\\") ? imgPath.slice(1) : imgPath);
        if (!fs.existsSync(filePath)) {
            return response.status(404).send('Img not found');
        }
        response.sendFile(filePath);
    }
    await client.close();
}
