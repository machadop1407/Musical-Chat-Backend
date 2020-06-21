const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.post("/", (req, res) => {
  var id = req.body.id;
  var requestGenresQuery = "SELECT genres FROM users WHERE spotifyId = ?";

  db.query(requestGenresQuery, id, (err, result) => {
    if (err) throw new Error();

    var matchByExactQuery =
      "SELECT * FROM users WHERE genres = ? AND NOT spotifyId = ?";
    db.query(matchByExactQuery, [result[0].genres, id], (err, matchResults) => {
      if (matchResults.length == 0) {
        res.send({ message: "No Matches Found" });
      } else {
        var finalMatch =
          matchResults[Math.floor(Math.random() * matchResults.length)];
        res.send(matchResults);
      }
    });
  });
});
module.exports = router;
