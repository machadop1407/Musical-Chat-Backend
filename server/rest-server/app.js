const express = require("express");
const app = express();
const dotenv = require("dotenv");
const server = require("http").createServer(app);
const cors = require("cors");
// const io = require("socket.io").listen(server);

//Database Configuration
const db = require("./config/db");

//CORS
app.use(cors());
app.use(express.json());

//Routes
var loginRoute = require("./routes/login");
app.use("/login", loginRoute);

// Port
const PORT = process.env.PORT || 7777;

server.listen(PORT, () => console.log("Server started!"));

module.exports = app;