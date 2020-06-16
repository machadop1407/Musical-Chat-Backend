const express = require("express");
const app = express();
const dotenv = require("dotenv");
const server = require("http").createServer(app);
// const io = require("socket.io").listen(server);

//Database Configuration
const db = require("./config/db");

//CORS
// app.use(cors())
app.use(express.json());

//Routes
var codeRoute = require("./routes/codeIntegration");
app.use("/", codeRoute);

var joinChatRoute = require("./routes/joinChat");
app.use("/api/join", joinChatRoute);

var chatRoute = require("./routes/chat");
app.use("/api/chat", chatRoute);

// Port
const PORT = process.env.PORT || 3030;

server.listen(PORT, () => console.log("Server started!"));

module.exports = app;
