const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/getuser/:id", (req, res) => {
  var id = req.params.id;

  db.query("SELECT * FROM users WHERE spotifyId = ?", id, (err, result) => {
    if (err) res.send({ message: err });
    res.send(result);
  });
});

router.get("/getmessages/:room", (req, res) => {
  var room = req.params.room;
  if (room == null || room == undefined) res.send({ message: "room is null" });
  db.query("SELECT * FROM messages WHERE room = ?", room, (err, results) => {
    if (err) res.send(err);

    res.send(results);
  });
});

router.post("/insertmessages", (req, res) => {
  let insertMessage = {
    message: req.body.content.message,
    usersent: req.body.content.author,
    room: req.body.room,
  };

  db.query("INSERT INTO messages SET ?", insertMessage, (err, result) => {
    if (err) res.send(err);

    res.send({ message: "success" });
  });
});

router.post("/deletemessages", (req, res) => {
  var room = req.body.room;
  db.query("DELETE FROM messages WHERE room = ?", room, (err, results) => {
    if (err) res.send({ error: err });

    res.send({ message: "Succesfully deleted message" });
  });
});

module.exports = router;
