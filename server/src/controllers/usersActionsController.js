const { adoptActionModel, donateActionModel, volunteerActionModel } = require("../models/usersActionsModels");

const connectionString = process.env.DB_CONNECTION_STRING;

const checkBody = (data, model) => {
    try {
        if (!data) {
            return "need body!";
        }
        if (
            Object.keys(model).length !== Object.keys(data).length
            || !Object.keys(model).every(key => data.hasOwnProperty(key))
        ) {
            return "incorrect params";
        }
        return true;

    } catch (error) {
        console.log("ERROR\n", data, error);
        return "something went wrong";
    }
}

exports.userWantAdopt = async function (request, response) {

    const data = request.body;

    try {
        const checkResult = checkBody(data, adoptActionModel);
        if (typeof checkResult === 'string') {
            response.status(400).send(checkResult);
            return;
        }

        const MongoClient = require("mongodb").MongoClient;
        const client = new MongoClient(connectionString);

        await client.connect();
        const db = client.db("user");
        const collection = db.collection("usersActions");

        const id = await collection.insertOne({
            action: "ADOPT",
            name: data.name,
            phone: data.phone,
            email: data.email,
            animalType: data.animalType,
            comment: data.comment,
            status: "Ожидание"
        })

        console.log(id)

        response.status(204).send(null);
        await client.close();
    }
    catch (error) {
        console.log(error);
        response.status(500).send("something went wrong")
    }
}

exports.userWantDonate = async function (request, response) {

    const data = request.body;

    try {
        const checkResult = checkBody(data, donateActionModel);
        if (typeof checkResult === 'string') {
            response.status(400).send(checkResult);
            return;
        }

        const MongoClient = require("mongodb").MongoClient;
        const client = new MongoClient(connectionString);

        await client.connect();
        const db = client.db("user");
        const collection = db.collection("usersActions");

        const id = await collection.insertOne({
            action: "DONATE",
            name: data.name,
            phone: data.phone,
            email: data.email,
            donateSize: data.donateSize,
            status: "Ожидание"
        })

        console.log(id)

        response.status(204).send(null);
        await client.close();

    } catch (error) {
        console.log(error);
        response.status(500).send("something went wrong")
    }
}

exports.userWantVolunteer = async function (request, response) {

    const data = request.body;

    try {
        const checkResult = checkBody(data, volunteerActionModel);
        if (typeof checkResult === 'string') {
            response.status(400).send(checkResult);
            return;
        }

        const MongoClient = require("mongodb").MongoClient;
        const client = new MongoClient(connectionString);

        await client.connect();
        const db = client.db("user");
        const collection = db.collection("usersActions");

        const id = await collection.insertOne({
            action: "VOLUNTEER",
            name: data.name,
            phone: data.phone,
            email: data.email,
            comment: data.comment,
            status: "Ожидание"
        })

        console.log(id)

        response.status(204).send(null);
        await client.close();

    } catch (error) {
        console.log(error);
        response.status(500).send("something went wrong")
    }
}