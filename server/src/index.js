const express = require("express");
const app = express();

const petsRoute = require("./routes/petsRoute");

app.use("/pets", petsRoute)

app.use(function (req, res, next) {
    res.status(404).send("Not Found")
});

app.listen(5000, () => {
    console.log('server start on port 5000')
});