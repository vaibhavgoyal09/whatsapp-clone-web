import React from "react";
import ChatHeader from "./ChatHeader";
import ChatFooter from "./ChatFooter";
import "../css/chattingScreenStyle.css";
import MessagesList from "./MessagesList";

const ChattingScreen = ({ currentUserModel, chat, messages, onProfileClick }) => {
  console.log(chat);
  if (!chat || !currentUserModel) {
    return null;
  }

  return (
    <div id="content">
      <div className="headerContainer">
        <ChatHeader
          profileImageUrl={chat.remoteUserProfileImageUrl}
          onProfileClick={() => onProfileClick(chat)}
          userName={chat.remoteUserName}
        />
      </div>
      <div className="messagesContainer">
        <MessagesList messagesList={messages} currentUserId={currentUserModel.id} />
      </div>
      <div className="footerContainer">
        <ChatFooter />
      </div>
    </div>
  );
};

export default ChattingScreen;
