require('dotenv').config();
const express = require("express");
const app = express();
const path = require('path');

const indexRouter = require("./routes/indexRouter");

app.use(express.urlencoded({ extended: true }));

const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use("/", indexRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', function(err) {
    if (err) console.log("Error in server setup")
    console.log("Started listening on %s", PORT);
});