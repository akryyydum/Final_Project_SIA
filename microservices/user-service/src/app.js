// app.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const authRoutes = require("./routes/userRoutes");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use("/api/auth", authRoutes);

module.exports = app;
