import React, { useEffect } from "react";
import "../../Styles/Messaging.css";

export default function Messaging({ username }) {
  return (
    <div className="messagingWrapper">
      <div className="header">
        <div id="username">@{username}</div>
      </div>
    </div>
  );
}
