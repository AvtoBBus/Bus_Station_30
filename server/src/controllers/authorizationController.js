const { ObjectId } = require("mongodb");
const { getUserActionsModel } = require("../models/usersActionsModels");

const connectionString = process.env.DB_CONNECTION_STRING;

const generateHash = async (data) => {
    const arrayBuffer = new TextEncoder().encode(data);
    const enc = await globalThis.crypto.subtle.digest("SHA-256", arrayBuffer);
    const uint8array = new Uint8Array(enc);
    return Array.from(uint8array)
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('');
}

exports.userinfo = async function (request, response) {

    const cookieToken = request.cookies.apiToken;
    if (!cookieToken) {
        response.status(401).send("need token");
        return;
    }
    else {
        const MongoClient = require("mongodb").MongoClient;
        const client = new MongoClient(connectionString);

        const db = client.db("user");
        const collection = db.collection("users");

        const userFromDB = await collection.find({ token: cookieToken }).toArray();

        if (userFromDB && userFromDB.length > 0) {

            response.setHeader('Content-Type', 'application/json');
            response.send({
                userId: userFromDB.at(0)._id,
                userName: userFromDB.at(0).userName,
                userRole: userFromDB.at(0).userRole,
            });
            return;
        }
        else {
            response.status(401).send("bad credentials");
        }

    }
}

exports.getUserActions = async function (request, response) {
    const cookieToken = request.cookies.apiToken;
    if (!cookieToken) {
        response.status(401).send("need token");
        return;
    }
    else {
        const MongoClient = require("mongodb").MongoClient;
        const client = new MongoClient(connectionString);

        const db = client.db("user");
        const collection = db.collection("users");

        const userFromDB = await collection.find({ token: cookieToken }).toArray();

        if (userFromDB && userFromDB.length > 0) {

            const actionsCollection = db.collection("usersActions");
            const userActionsHistory = await actionsCollection.find({ name: userFromDB.at(0).userName }).project(getUserActionsModel).toArray();

            response.setHeader('Content-Type', 'application/json');
            response.send(userActionsHistory);
            return;
        }
        else {
            response.status(401).send("bad credentials");
        }

    }
}

exports.auth = async function (request, response) {
    const data = request.body;

    if (
        data
        && data.username
        && data.password
    ) {
        const res = await generateHash(data.password);

        const MongoClient = require("mongodb").MongoClient;
        const client = new MongoClient(connectionString);

        const db = client.db("user");
        const collection = db.collection("users");

        const userFromDB = await collection.find({ userName: data.username }).toArray();

        if (userFromDB && userFromDB.length > 0) {

            if (userFromDB.at(0).password !== res) {
                response.status(400).send("bad credentials");
                return;
            }
            response.setHeader('Content-Type', 'application/json');


            const newToken = await generateHash(userFromDB.at(0).password + Math.random().toString() + userFromDB.at(0).salt);

            await collection.updateOne(
                { _id: new ObjectId(userFromDB.at(0)._id) },
                { $set: { "token": newToken } }
            );

            response.cookie(
                "apiToken",
                newToken,
                {
                    maxAge: 1000 * 60 * 15,
                    httpOnly: true,
                    sameSite: "none",
                    secure: true
                })
            response.send({
                userId: userFromDB.at(0)._id,
                userName: userFromDB.at(0).userName,
                userRole: userFromDB.at(0).userRole
            });
            return;
        }
        else {
            response.status(400).send("bad credentials");
        }
        response.status(500).send("Something went wrong");
    }
}

exports.logout = async function (request, response) {

    const cookieToken = request.cookies.apiToken;
    if (!cookieToken) {
        response.status(401).send("need token");
        return;
    }

    const MongoClient = require("mongodb").MongoClient;
    const client = new MongoClient(connectionString);

    const db = client.db("user");
    const collection = db.collection("users");

    const userFromDB = await collection.find({ token: cookieToken }).toArray();

    await collection.updateOne(
        { _id: new ObjectId(userFromDB.at(0)._id) },
        { $set: { "token": "" } }
    );

    response.clearCookie("apiToken");
    response.status(204);
    response.send(null);
}