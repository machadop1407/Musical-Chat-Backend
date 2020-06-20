const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.post("/", (req, res) => {
  var tracks = [];
  req.body.topTracks.map((val) => {
    if (val.name.includes(",")) {
      tracks.push(val.name.replace(",", "{"));
    } else {
      tracks.push(val.name);
    }
  });
  db.query(
    "SELECT * FROM users WHERE spotifyId = ?",
    req.body.spotifyId,
    (err, row) => {
      if (row) {
        var query = "UPDATE users SET topTracks = ? WHERE spotifyId = ?";
        db.query(
          query,
          [tracks.toString(), req.body.spotifyId],
          (err, results) => {
            if (err) console.log(err);
          }
        );
      } else {
        console.log("wtf");
        let clientData = {
          username: req.body.username,
          spotifyId: req.body.spotifyId,
          topTracks: tracks.toString(),
        };
        var query = "INSERT INTO users SET ?";
        db.query(query, clientData, (err, results) => {
          if (err) console.log(err);
          console.log("inserted");
        });
      }
    }
  );
});

module.exports = router;
