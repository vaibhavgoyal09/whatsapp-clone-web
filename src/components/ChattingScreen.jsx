import React from "react";
import ChatHeader from "./ChatHeader";
import ChatFooter from "./ChatFooter";
import "../css/chattingScreenStyle.css";
import { useState } from "react";
import ReceivedMessageItem from "./ReceivedMessageItem";
import SentMessageItem from "./SentMessageItem";

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
    let request = {
      type: 0,
      own_user_id: currentUserModel.id,
      to_user_id: chat.remoteUserId,
      chat_id: chat.id,
      media_url: null,
      text: messageText,
    };
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
        <div className="listContainer">
          {messages.map((message, index) =>
            message.senderId === currentUserModel.id ? (
              <SentMessageItem message={message} key={index} />
            ) : (
              <ReceivedMessageItem message={message} key={index} />
            )
          )}
        </div>
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
