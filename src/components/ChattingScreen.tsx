import React from "react";
import ChatHeader from "./ChatHeader";
import ChatFooter from "./ChatFooter";
import "../css/chattingScreenStyle.css";
import { useState } from "react";
import ReceivedMessageItem from "./ReceivedMessageItem";
import SentMessageItem from "./SentMessageItem";
import User, { OnlineStatus } from "../models/User";
import Chat, { ChatType } from "../models/Chat";
import Message from "../models/Message";
import SendMessageRequest from "../models/SendMessageRequest";
import Utils from "../utils/Utils";

interface Props {
  currentUserModel: User;
  chat: Chat;
  messages: Message[];
  remoteUser: User | null;
  onProfileClick: () => void;
  onSendMessage: (request: SendMessageRequest) => void;
  onTypingStatusChange: (isTyping: boolean) => void;
}

const ChattingScreen: React.FC<Props> = ({
  currentUserModel,
  chat,
  messages,
  onProfileClick,
  onSendMessage,
  onTypingStatusChange,
  remoteUser
}) => {
  const [messageText, setMessageText] = useState("");

  if (!chat || !currentUserModel) {
    return null;
  }

  let isUserOnline: boolean | null = null;
  let lastOnlineAt: number | null = null; 

  if (chat.type === ChatType.oneToOne) {
    if (!remoteUser) {
      return null;
    } else {
      isUserOnline = remoteUser.onlineStatus === OnlineStatus.online;
      lastOnlineAt = remoteUser.lastOnlineAt;
    } 
  }

  const sendMessage = () => {
    if (messageText === "") {
      return;
    }
    let remoteUserId;
    if (remoteUser) {
      remoteUserId = remoteUser.id;
    } else {
      remoteUserId= Utils.getRemoteUserIdFromChat(chat, currentUserModel.id);
    }
    let request: SendMessageRequest = {
      type: 0,
      own_user_id: currentUserModel.id,
      to_user_id: remoteUserId,
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
          name={chat.name}
          type={chat.type}
          isUserOnline={isUserOnline}
          lastOnlineAt={lastOnlineAt}
        />
      </div>
      <div className="messagesContainer">
        <div className="listContainer">
          {messages.map((message: Message) =>
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
          onSendMessage={() => sendMessage()}
          onMessageFieldValueChange={(value: string) => setMessageText(value)}
          onTypingStatusChange={(isTyping: boolean) =>
            onTypingStatusChange(isTyping)
          }
        />
      </div>
    </div>
  );
};

export default ChattingScreen;
