import React, { useState, useEffect } from "react";
import "../../Styles/FindingMatch.css";

export default function FindingMatch({ spotify, topTracks }) {
  const [name, setName] = useState("");

  // useEffect(() => {}, []);

  const findMatch = () => {
    var favoriteGenres = [];
    var genres = [];

    Array.prototype.byCount = function () {
      var itm,
        a = [],
        L = this.length,
        o = {};
      for (var i = 0; i < L; i++) {
        itm = this[i];
        if (!itm) continue;
        if (o[itm] == undefined) o[itm] = 1;
        else ++o[itm];
      }
      for (var p in o) a[a.length] = p;
      return a.sort(function (a, b) {
        return o[b] - o[a];
      });
    };

    topTracks.map((track) => {
      spotify.getArtist(track.artists[0].id).then((artist) => {
        favoriteGenres.push(artist.genres[0]);
      });
    });

    var timeout = setInterval(function () {
      if (favoriteGenres.length != 0) {
        console.log(favoriteGenres.byCount());
        clearInterval(timeout);
      }
    }, 100);
    // console.log(Object.(favoriteGenres));
  };

  return (
    <div className="matchWrapper">
      <h1>Find A New Match!</h1>
      <input type="text" placeholder={name} />
      <button id="matchBttn" onClick={findMatch}>
        Search
      </button>
    </div>
  );
}
