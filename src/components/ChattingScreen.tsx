import React from "react";
import ChatHeader from "./ChatHeader";
import ChatFooter from "./ChatFooter";
import "../css/chattingScreenStyle.css";
import { useState } from "react";
import ReceivedMessageItem from "./ReceivedMessageItem";
import SentMessageItem from "./SentMessageItem";
import User from '../models/User';
import Message from '../models/Message';


interface Props {
  currentUserModel: User,
  chat: any,
  messages :any,
  onProfileClick: () => void,
  onSendMessage: any
}


const ChattingScreen: React.FC<Props> = ({
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

  const sendMessage = (text?: string) => {
    if (text === "") {
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
          {messages.map((message: Message, index: number) =>
            message.senderId === currentUserModel.id ? (
              <SentMessageItem message={message} key={message.id} />
            ) : (
              <ReceivedMessageItem message={message} key={message.id} />
            )
          )}
        </div>
      </div>
      <div className="footerContainer">
        <ChatFooter
          onSendMessage={(text?: string) => sendMessage(text)}
        />
      </div>
    </div>
  );
};

export default ChattingScreen;
