const express = require("express");
const cookieParser = require('cookie-parser')
const cors = require('cors')
const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: true
}));

const petsRoute = require("./routes/petsRoute");
app.use("/pets", petsRoute);

const usersActionsRoute = require("./routes/usersActionsRoute");
app.use("/usersActions", usersActionsRoute);

const authRoute = require("./routes/userRoute");
app.use("/login", authRoute);

app.use(function (req, res, next) {
    res.status(404).send("Not Found")
});

app.listen(5000, () => {
    console.log('server start on port 5000')
});