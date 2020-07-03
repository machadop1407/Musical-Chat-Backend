const express = require("express");
const app = express();
const dotenv = require("dotenv");
const server = require("http").createServer(app);
const cors = require("cors");

var socket = require("socket.io");

io = socket(server);

io.on("connection", (socket) => {
  console.log(socket.id);

  socket.on("SEND_MESSAGE", function (data) {
    socket.to(data.room).emit("RECEIVE_MESSAGE", data.content);
  });

  socket.on("joinroom", function (data) {
    socket.join(data);
    console.log("Joined room:" + data);
  });

  socket.on("disconnect", () => {
    console.log("user left");
  });
});

//CORS
app.use(cors());
app.use(express.json());

//Routes
var loginRoute = require("./routes/login");
app.use("/login", loginRoute);
var matchingRoute = require("./routes/matching");
app.use("/matching", matchingRoute);
var chatRoute = require("./routes/chat");
app.use("/chat", chatRoute);

// Port
const PORT = process.env.PORT || 7777;

server.listen(PORT, () => console.log("Server started!"));

module.exports = app;
