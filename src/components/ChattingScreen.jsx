import React from "react";
import ChatHeader from "./ChatHeader";
import ChatFooter from "./ChatFooter";
import "../css/chattingScreenStyle.css";
import MessagesList from "./MessagesList";

const ChattingScreen = ({ currentUser, chat, messages, onProfileClick }) => {
  console.log(chat);
  if (!chat) {
    return null;
  }

  return (
    <div id="content">
      <div className="headerContainer">
        <ChatHeader
          profileImageUrl={chat.getRemoteUserProfileImageUrl()}
          onProfileClick={() => onProfileClick(chat)}
        />
      </div>
      <div className="messagesContainer">
        <MessagesList messagesList={messages} currentUser={currentUser} />
      </div>
      <div className="footerContainer">
        <ChatFooter />
      </div>
    </div>
  );
};

export default ChattingScreen;
