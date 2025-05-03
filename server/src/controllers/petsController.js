const { ObjectId } = require("mongodb");
const { getPetModel } = require("../models/getPetModel");
const fs = require("fs")

const connectionString = process.env.DB_CONNECTION_STRING;

async function checkForScripts(filePath) {
    const buffer = fs.readFileSync(filePath);

    const content = buffer.toString('utf8');
    const dangerousPatterns = [
        /<\?php/i,
        /<script/i,
        /eval\(/i,
        /base64_decode/i,
        /onload=/i,
        /onerror=/i
    ];

    return !dangerousPatterns.some(pattern => pattern.test(content));
}

exports.getPetsList = async function (request, response) {
    const MongoClient = require("mongodb").MongoClient;
    const client = new MongoClient(connectionString);

    await client.connect();
    const db = client.db("pets");
    const collection = db.collection("petsCollection");
    const petsList = await collection.find().project(getPetModel).toArray();
    response.send(petsList);
    await client.close();
}

exports.getPetById = async function (request, response) {
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
    const petsList = await collection.find({ "_id": new ObjectId(petId) }).toArray();
    response.send(petsList);
    await client.close();
}

exports.addNewAnimal = async function (request, response) {

    try {

        const cookieToken = request.cookies.apiToken;
        if (!cookieToken) {
            response.status(401).send("Need token");
            return;
        }

        const data = request.body;

        if (!data) {
            response.status(400).send("Incorrect body");
            return;
        }

        const animalType = new URLSearchParams(request.query).get("animalType");

        if (!animalType) {
            response.status(400).send("Need animal type in query string")
        }

        if (!request.file) {
            return response.status(400).send('Need file');
        }

        const isSafe = await checkForScripts(request.file.path);

        if (!isSafe) {
            fs.unlinkSync(request.file.path);
            return res.status(403).send('Not an image');
        }

        const MongoClient = require("mongodb").MongoClient;
        const client = new MongoClient(connectionString);

        await client.connect();
        const db = client.db("pets");
        const collection = db.collection("petsCollection");
        await collection.insertOne({
            animalType: data.animalType,
            animalName: data.animalName,
            breed: data.breed,
            age: Number.parseInt(data.age),
            features: data.features,
            img: request.file.path.startsWith("\\") ? request.file.path : `\\${request.file.path}`,
            illness: data.illness,
            status: data.status
        })
        response.status(204).send(null);
        await client.close();

    } catch (error) {
        console.log(error)
        response.status(500).send("Something went wrong");
    }
}