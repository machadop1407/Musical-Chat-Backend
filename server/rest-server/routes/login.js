const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.post("/", (req, res) => {
  db.query(
    "SELECT * FROM users WHERE spotifyId = ?",
    req.body.spotifyId,
    (err, row) => {
      if (row) {
        var query = "UPDATE users SET genres = ? WHERE spotifyId = ?";
        db.query(
          query,
          [req.body.genres, req.body.spotifyId],
          (err, results) => {
            if (err) console.log(err);
          }
        );
      } else {
        let clientData = {
          username: req.body.username,
          spotifyId: req.body.spotifyId,
          genres: req.body.genres,
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
