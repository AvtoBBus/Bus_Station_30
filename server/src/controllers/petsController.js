const { ObjectId } = require("mongodb");
const { getPetModel } = require("../models/getPetModel");

const connectionString = process.env.DB_CONNECTION_STRING;

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