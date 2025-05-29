const { ObjectId } = require("mongodb");
const { getUserActionsModel, getUserActionsModelAdmin } = require("../models/usersActionsModels");

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
                phone: userFromDB.at(0).phone,
                city: userFromDB.at(0).city,
                email: userFromDB.at(0).email
            });
            return;
        }
        else {
            response.status(401).send("bad credentials");
        }

        await client.close();
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
            let userActionsHistory = [];

            if (userFromDB.at(0).userRole === "admin") userActionsHistory = await actionsCollection.find({}).project(getUserActionsModelAdmin).toArray();
            else userActionsHistory = await actionsCollection.find({ name: userFromDB.at(0).userName }).project(getUserActionsModel).toArray();

            response.setHeader('Content-Type', 'application/json');
            response.send(userActionsHistory);
            await client.close();
            return;
        }
        else {
            response.status(401).send({ error: "bad credentials" });
        }
        await client.close();
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
                })
            response.send({
                userId: userFromDB.at(0)._id,
                userName: userFromDB.at(0).userName,
                userRole: userFromDB.at(0).userRole,
                phone: userFromDB.at(0).phone,
                city: userFromDB.at(0).city,
                email: userFromDB.at(0).email
            });
            await client.close();
            return;
        }
        else {
            await client.close();
            response.status(400).send("bad credentials");
        }
        await client.close();
        response.status(500).send("Something went wrong");
    }
}

exports.register = async function (request, response) {
    const data = request.body;

    if (
        data
        && data.username
        && data.password
        && data.email
        && data.phone
        && data.city
    ) {
        const MongoClient = require("mongodb").MongoClient;
        const client = new MongoClient(connectionString);

        const db = client.db("user");
        const collection = db.collection("users");

        const userFromDB = await collection.find({ userName: data.username }).toArray();

        if (userFromDB && userFromDB.length === 0) {

            response.setHeader('Content-Type', 'application/json');

            const res = await generateHash(data.password);
            const newToken = await generateHash(data.password + Math.random().toString() + "e689a7d4654e89347da40956b32465b1a60e1c24cf2c4446e6d9d6d994029186");

            await collection.insertOne({
                "userName": data.username,
                "userRole": "user",
                "password": res,
                "token": newToken,
                "salt": "e689a7d4654e89347da40956b32465b1a60e1c24cf2c4446e6d9d6d994029186",
                "city": data.city,
                "email": data.email,
                "phone": data.phone
            });

            const newUser = await collection.find({ userName: data.username }).toArray();

            response.cookie(
                "apiToken",
                newToken,
                {
                    maxAge: 1000 * 60 * 15,
                    httpOnly: true,
                    sameSite: "none",
                    secure: true
                })
            response.status(200).send({
                userId: newUser.at(0)._id,
                userName: newUser.at(0).userName,
                userRole: newUser.at(0).userRole,
                phone: newUser.at(0).phone,
                city: newUser.at(0).city,
                email: newUser.at(0).email
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
    await client.close();
}

exports.updateUserInfo = async function (request, response) {
    const data = request.body;
    const cookieToken = request.cookies.apiToken;

    if (!cookieToken) {
        response.status(401).send("need token");
        return;
    }

    if (
        !data || (
            !data.hasOwnProperty("id")
            || !data.hasOwnProperty("userName")
            || !data.hasOwnProperty("city")
            || !data.hasOwnProperty("email")
            || !data.hasOwnProperty("phone")
        )) {
        response.status(400).send("incorrect data");
        return;
    }

    const MongoClient = require("mongodb").MongoClient;
    const client = new MongoClient(connectionString);

    const db = client.db("user");
    const collection = db.collection("users");

    const userFromDB = await collection.find({ token: cookieToken }).toArray();

    if (userFromDB.length === 0) {
        response.status(404).send("not found user");
        await client.close()
        return;
    }

    if (userFromDB.at(0)._id.toString() !== data.id) {
        response.status(403).send("this is not you");
        await client.close()
        return;
    }

    await collection.updateOne(
        { _id: userFromDB.at(0)._id },
        {
            $set: {
                "userName": data.userName,
                "city": data.city,
                "email": data.email,
                "phone": data.phone
            }
        }
    )

    response.status(204).send(null)
    return;

}

exports.updateActionStatus = async function (request, response) {
    const data = request.body;
    const STATUSES = ["Ожидание", "Одобрено", "Отклонено"]

    const cookieToken = request.cookies.apiToken;
    if (!cookieToken) {
        response.status(401).send("need token");
        return;
    }

    const actionId = data.id;
    const newActionStatus = data.status;

    if (!actionId) {
        response.status(400).send("need action id");
        return;
    }

    if (!newActionStatus || !STATUSES.includes(newActionStatus)) {
        response.status(400).send("need correct status");
        return;
    }

    const MongoClient = require("mongodb").MongoClient;
    const client = new MongoClient(connectionString);

    const db = client.db("user");
    const collection = db.collection("users");

    const userFromDB = await collection.find({ token: cookieToken }).toArray();

    if (userFromDB.at(0).userRole !== "admin") {
        response.status(403).send("only for admin");
        await client.close();
        return;
    }

    const actionsCollection = db.collection("usersActions");
    const updateResult = await actionsCollection.updateOne(
        { _id: new ObjectId('' + actionId.trim()) },
        { $set: { status: newActionStatus } }
    )

    if (updateResult.modifiedCount === 0) {
        response.status(400).send("action not found");
        await client.close();
        return;
    }

    response.status(204).send(null);
    await client.close();
    return;

}