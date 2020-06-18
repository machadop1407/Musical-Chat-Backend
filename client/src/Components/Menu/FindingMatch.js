import React, { useState, useEffect } from "react";
import "../../Styles/FindingMatch.css";

export default function FindingMatch({ spotify }) {
  const [name, setName] = useState("");

  useEffect(() => {}, []);

  return (
    <div className="matchWrapper">
      <h1>Find A New Match!</h1>
      <input type="text" placeholder={name} />
      <button id="matchBttn"> Search</button>
    </div>
  );
}
