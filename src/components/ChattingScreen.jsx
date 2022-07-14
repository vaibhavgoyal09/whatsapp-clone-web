import React from "react";
import ChatHeader from "./ChatHeader";
import ChatFooter from "./ChatFooter";
import "../css/chattingScreenStyle.css";
import MessagesList from "./MessagesList";
import SendMessageRequest from "../models/SendMessageRequest";
import { useState } from "react";

const ChattingScreen = ({
  currentUserModel,
  chat,
  messages,
  onProfileClick,
  onSendMessage,
}) => {
  const [messageText, setMessageText] = useState("");

  if (!chat || !currentUserModel) {
    return null;
  }

  const sendMessage = () => {
    if (messageText === "") {
      return;
    }
    let request = new SendMessageRequest(
      0,
      currentUserModel.id,
      chat.remoteUserId,
      chat.id,
      null,
      messageText
    );
    onSendMessage(request);
    setMessageText("");
  };

  return (
    <div id="content">
      <div className="headerContainer">
        <ChatHeader
          profileImageUrl={chat.remoteUserProfileImageUrl}
          onProfileClick={() => onProfileClick()}
          userName={chat.remoteUserName}
        />
      </div>
      <div className="messagesContainer">
        <MessagesList
          messagesList={messages}
          currentUserId={currentUserModel.id}
        />
      </div>
      <div className="footerContainer">
        <ChatFooter
          onSendMessage={() => sendMessage()}
          messageText={messageText}
          onMessageTextChange={(value) => setMessageText(value)}
        />
      </div>
    </div>
  );
};

export default ChattingScreen;
