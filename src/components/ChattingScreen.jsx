import React from "react";
import ChatHeader from "./ChatHeader";
import '../css/chatHeaderStyle.css'

const ChattingScreen = ({currentUser, chat}) => {
  return (
    <div id="content">
      <ChatHeader />
    </div>
  );
};

export default ChattingScreen;
