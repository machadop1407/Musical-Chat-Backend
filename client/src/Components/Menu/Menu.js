import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../Styles/Menu.css";
import AudioWave from "./AudioWave";
import Fire from "../../Images/fire.gif";
import FindingMatch from "./FindingMatch";
import Messaging from "./Messaging";

export default function Menu({ spotify }) {
  const [topTracks, setTopTracks] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    setUsername("Username");
    spotify.getMyTopTracks().then((res) => {
      setTopTracks(res.items);
    });

    spotify
      .getMyCurrentPlaybackState()
      .then((res) => {
        console.log(res.item.name);
        setCurrentSong(res.item.name);
      })
      .catch(() => {
        setCurrentSong("Music Not Playing");
      });

    spotify.getMe().then((res) => {
      let postQuery = { username: res.display_name, spotifyId: res.id };
      setUsername(res.display_name);
      axios
        .post("http://192.168.100.2:7777/login", postQuery)
        .then(() => console.log("worked"));
    });
  }, []);

  return (
    <>
      <div className="row menuPage">
        <div className="leftCol">
          <div className="messaging">
            <Messaging username={username} />
          </div>
        </div>
        <div className="rightCol">
          <div className="findingMatch">
            <FindingMatch spotify={spotify} />
          </div>
          <div className="topTracks">
            <div className="topTracksTitle">
              <h1>Your Top 20 </h1>
              <img src={Fire} id="fireEmoji" />
            </div>

            {topTracks.length > 0 && (
              <table>
                <tbody>
                  {topTracks.map((tracks, key) => (
                    <tr key={key + 1}>
                      <td id="id">{key + 1}</td>
                      <a href={tracks.external_urls.spotify} target="_blank">
                        <td id="tracks">
                          {tracks.name.length > 15
                            ? tracks.name.substr(0, 15).toLowerCase() + "..."
                            : tracks.name}
                        </td>
                      </a>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      <div className="row bottomMenu">
        <div className="bottomMenuContent">
          <AudioWave isListening={currentSong != "Music Not Playing"} />
          {currentSong != "Music Not Playing" && (
            <h1>Now Playing: {currentSong}</h1>
          )}
          {currentSong == "Music Not Playing" && <h1>{currentSong}</h1>}
        </div>
      </div>
    </>
  );
}
