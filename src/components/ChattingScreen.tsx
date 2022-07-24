import React from "react";
import ChatHeader from "./ChatHeader";
import ChatFooter from "./ChatFooter";
import "../css/chattingScreenStyle.css";
import { useState } from "react";
import ReceivedMessageItem from "./ReceivedMessageItem";
import SentMessageItem from "./SentMessageItem";
import User from '../models/User';
import Chat from "../models/Chat";
import Message from "../models/Message";
import SendMessageRequest from "../models/SendMessageRequest";


interface Props {
  currentUserModel: User,
  chat: Chat,
  messages: Message[],
  onProfileClick: () => void,
  onSendMessage: (request: SendMessageRequest) => void;
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
    let remoteUser = chat.users.filter((user: User) => {
      return user.id !== currentUserModel.id;
    })[0];
    let request: SendMessageRequest = {
      type: 0,
      own_user_id: currentUserModel.id,
      to_user_id: remoteUser.id,
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
          profileImageUrl={chat.profileImageUrl}
          onProfileClick={() => onProfileClick()}
          userName={chat.name}
        />
      </div>
      <div className="messagesContainer">
        <div className="listContainer">
          {messages.map((message: Message,) =>
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
