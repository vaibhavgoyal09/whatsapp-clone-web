import React from "react";
import ChatHeader from "./ChatHeader";
import ChatFooter from "./ChatFooter";
import '../css/chattingScreenStyle.css';
import MessagesList from "./MessagesList";

const ChattingScreen = ({ currentUser, chat, onProfileClick, onVideoCallStarted, onAudioCallStarted }) => {
  return (
    <div id="content">
      <div className="headerContainer">
        <ChatHeader />
      </div>
      <div className="messagesContainer">
        <MessagesList />
      </div>
      <div className="footerContainer">
        <ChatFooter />
      </div>
    </div>
  );
};

export default ChattingScreen;
