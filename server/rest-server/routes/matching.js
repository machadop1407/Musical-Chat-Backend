const express = require("express");
const router = express.Router();
const db = require("../config/db");

/* DESIGN
 * OPEN FOR MATCHING VS. NOT OPEN FOR MATCHING
 * IF NOT OPEN FOR MATCHING: ONLY MATCH WHEN THEY REQUEST --> OPEN FOR MATCH => false
 * IF OPEN FOR MATCHING: CAN MATCH AT ANY TIME --> OPEN FOR MATCH => true
 *
 * REQUESTING MATCH:
 * SEARCH IN ALL USERS WHERE : OPENFORMATCH = TRUE && MATCH = NULL
 *
 * IF OPEN FOR MATCH : CAN BE MATCHED EVEN WHILE NOT SEARCHING
 */

///REQUESTING MATCH

router.post("/", (req, res) => {
  var id = req.body.id;
  // var username = req.body.username;
  var requestGenresQuery = "SELECT genres FROM users WHERE spotifyId = ?";

  /* REQUEST all the genres from user who is looking
   * for a match.
   * Results = user favorite genre
   */
  db.query(requestGenresQuery, id, (err1, result) => {
    if (err1) res.send(err1);

    var matchByExactQuery =
      "SELECT * FROM users WHERE genres = ? AND NOT spotifyId = ? AND matchuser = 0";

    /* REQUEST all users with the same genre
     * Results = Array with all matching users
     */

    db.query(
      matchByExactQuery,
      [result[0].genres, id],
      (err2, matchResults) => {
        if (matchResults.length == 0) {
          // CASE: No Exact match found
          var randomFIndingQuery =
            "SELECT * FROM users WHERE NOT spotifyId = ? AND matchuser = 0 ORDER BY RAND() LIMIT 5;";
          db.query(randomFIndingQuery, id, (err3, randomChosenResults) => {
            if (err3) res.send(err3);

            var userGenreRanking = [
              {
                user: {},
                ranking: 0,
              },
            ];
            for (var i = 0; i < randomChosenResults.length; i++) {
              var similarityRanking = similarity(
                result[0].genres,
                randomChosenResults[i].genres
              );
              userGenreRanking.push({
                user: randomChosenResults[i],
                ranking: similarityRanking,
              });
            }

            var highestRank = 0;
            var highestRankedUser = {};
            for (var j = 0; j < userGenreRanking.length; j++) {
              if (userGenreRanking[j].ranking > highestRank) {
                highestRank = userGenreRanking[j].ranking;
                highestRankedUser = userGenreRanking[j].user;
              }
            }

            var updateMatchQuery =
              "UPDATE users SET matchuser = IF(spotifyId=?, ?, ?) WHERE spotifyId IN (?,?); UPDATE users SET room = ? WHERE spotifyId = ?; UPDATE users SET room = ? WHERE spotifyId = ?;";

            db.query(
              updateMatchQuery,
              [
                id,
                highestRankedUser.spotifyId,
                id,
                id,
                highestRankedUser.spotifyId,
                id,
                id,
                id,
                highestRankedUser.spotifyId,
              ],
              (err4, updateResult) => {
                if (err4) res.send({ error: err4 });
                res.send(highestRankedUser);
              }
            );
          });
        } else {
          //Randomnly choosing from the matching users
          var finalMatch =
            matchResults[Math.floor(Math.random() * matchResults.length)];
          var updateMatchQuery =
            "UPDATE users SET matchuser = IF(spotifyId=?, ?, ?) WHERE spotifyId IN (?,?); UPDATE users SET room = ? WHERE spotifyId = ?; UPDATE users SET room = ? WHERE spotifyId = ?;";
          db.query(
            updateMatchQuery,
            [
              id,
              finalMatch.spotifyId,
              id,
              id,
              finalMatch.spotifyId,
              id,
              id,
              id,
              finalMatch.spotifyId,
            ],
            (err4, updateResult) => {
              if (err4) res.send({ error: err4 });

              res.send(finalMatch);
            }
          );
        }
      }
    );
  });
});

//FIND SIMILARITY BETWEEN TWO STRINGS BASED ON DISTANCE
function similarity(string1, string2) {
  var longer = string1;
  var shorter = string2;
  if (string1.length < string2.length) {
    longer = string2;
    shorter = string1;
  }
  var longerLength = longer.length;
  if (longerLength == 0) {
    return 1.0;
  }
  return (
    (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength)
  );
}

//COMPARE STRING DISTANCE
function editDistance(string1, string2) {
  string1 = string1.toLowerCase();
  string2 = string2.toLowerCase();

  var costs = new Array();
  for (var i = 0; i <= string1.length; i++) {
    var lastValue = i;
    for (var j = 0; j <= string2.length; j++) {
      if (i == 0) costs[j] = j;
      else {
        if (j > 0) {
          var newValue = costs[j - 1];
          if (string1.charAt(i - 1) != string2.charAt(j - 1))
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0) costs[string2.length] = lastValue;
  }
  return costs[string2.length];
}

//RETURN MATCH
router.get("/returnmatch/:id", (req, res) => {
  var id = req.params.id;
  db.query("SELECT * FROM users WHERE spotifyId = ?", id, (err, results1) => {
    if (err) res.send({ error: err });

    if (results1[0].matchuser == 0) {
      res.send({ message: 0 });
    } else {
      db.query(
        "SELECT * FROM users WHERE spotifyId = ?",
        results1[0].matchuser,
        (err2, results2) => {
          if (err2) res.send({ error: err2 });

          res.send(results2[0]);
        }
      );
    }
  });
});

//DELETE MATCH
router.post("/deletematch", (req, res) => {
  var matchId = req.body.id;
  db.query(
    "UPDATE users SET matchuser = 0, room = null WHERE spotifyId = ?",
    matchId,
    (err, result) => {
      if (err) res.send(err);
      res.send({ message: "Success" });
    }
  );
});
module.exports = router;
