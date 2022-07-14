import React from "react";
import ChatHeader from "./ChatHeader";
import ChatFooter from "./ChatFooter";
import "../css/chattingScreenStyle.css";
import MessagesList from "./MessagesList";
import SendMessageRequest from '../models/SendMessageRequest';

const ChattingScreen = ({ currentUserModel, chat, messages, onProfileClick, onSendMessage }) => {
  console.log(chat);
  if (!chat || !currentUserModel) {
    return null;
  }

  const sendMessage = (messageText) => {
    let request = new SendMessageRequest(0, currentUserModel.id, chat.remoteUserId, chat.id, null, messageText);
    onSendMessage(request);
  };

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
        <ChatFooter onSendMessage={(messageText) => sendMessage(messageText)}/>
      </div>
    </div>
  );
};

export default ChattingScreen;
