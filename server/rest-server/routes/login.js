const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.post("/", (req, res) => {
  db.query(
    "SELECT * FROM users WHERE spotifyId = ?",
    req.body.spotifyId,
    (err, row) => {
      if (err) res.send({ error: err });
      if (row.length > 0) {
        var query = "UPDATE users SET genres = ? WHERE spotifyId = ?";
        db.query(
          query,
          [req.body.genres, req.body.spotifyId],
          (err1, results) => {
            if (err1) res.send({ error: err1 });
            res.send({ message: "success" });
          }
        );
      } else {
        let clientData = {
          username: req.body.username,
          spotifyId: req.body.spotifyId,
          genres: req.body.genres,
          matchuser: 0,
        };
        var query = "INSERT INTO users SET ?";
        db.query(query, clientData, (err2, results) => {
          if (err2) res.send({ error: err2 });
          res.send({ message: "success" });
        });
      }
    }
  );
});

module.exports = router;
