import React, { useState, useEffect } from "react";
import "../Styles/Menu.css";

export default function Menu({ spotify }) {
  const [topTracks, setTopTracks] = useState([]);

  useEffect(() => {
    spotify.getMyTopTracks().then((res) => {
      console.log(res.items);
      setTopTracks(res.items);
    });
  }, []);

  return (
    <div className="row menuPage">
      <div className="col-sm-8"></div>
      <div className="col-sm-4">
        {topTracks.length > 0 && (
          <table>
            <tbody>
              {topTracks.map((tracks, key) => (
                <tr key={key + 1}>
                  <td id="id">{key + 1}</td>
                  <a href={tracks.external_urls.spotify} target="_blank">
                    <td id="tracks">
                      {tracks.name.length > 15
                        ? tracks.name.substr(0, 15) + "..."
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
  );
}
