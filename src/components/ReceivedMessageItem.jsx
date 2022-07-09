import React from "react";

const ReceivedMessageItem = ({ message }) => {
  return (
    <div class="message-right-box">
      <div class="message">
        <p class="message-line">{ message.getText() }</p>
        <p class="message-time">{message.getTimestamp()}</p>
      </div>
      <img
        src="../assets/right_tile.png"
        class="triangle-icon"
        alt=""
      />
    </div>
  );
};

export default ReceivedMessageItem;
