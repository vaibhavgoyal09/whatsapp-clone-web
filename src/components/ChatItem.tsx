import moment from "moment";
import React, { createRef, useState, useEffect } from "react";
import "../css/chatItemStyle.css";
import Chat, { ChatType } from "../models/Chat";
import { MessageType } from "../models/Message";

interface Props {
  chat: Chat;
  onChatClick: () => void;
  isSelected: boolean;
}

const ChatItem: React.FC<Props> = ({ chat, onChatClick, isSelected }) => {
  const contentRef = createRef<HTMLDivElement>();
  const [typingStatus, setTypingStatus] = useState<string | null>(null);

  useEffect(() => {
    console.log("Use effect called")
    if (chat.type === ChatType.oneToOne) {
      console.log(chat);
      console.log(chat.typingUsersIds.length);
      if (chat.typingUsersIds.length === 1) {
        console.log("typing...")
        setTypingStatus("typing...");
      } else {
        console.log("not typing...")
        setTypingStatus(null);
      }
    }
  }, [chat]);

  if (!chat) {
    return null;
  }

  const message = chat.lastMessage;
  let messageText: string = "Tap to start chatting";

  var timestamp = "";
  if (message) {
    let date = moment.unix(message.timestamp / 1000).format("DD MMM - LT");
    timestamp = date;

    if (message.type === MessageType.image) {
      messageText = "Image";
    } else if (message.type === MessageType.video) {
      messageText = "Video";
    } else if (message.type === MessageType.text) {
      messageText = message.text ? message.text : "Tap to start chatting";
    }
  }

  return (
    <div
      className={isSelected ? "cn cnWithBg" : "cn"}
      ref={contentRef}
      onClick={() => onChatClick()}
    >
      <img
        src={chat.profileImageUrl ? chat.profileImageUrl : "avatar.png"}
        alt="user profile"
        className="avatar"
      />
      <div className="infoContainer">
        <div className="unamec">
          <p className="uname unselectable">{chat.name}</p>
          {typingStatus ? (
            <p className="usecText utys unselectable">{typingStatus}</p>
          ) : (
            <p className="usectext umsg unselectable">{messageText}</p>
          )}
        </div>
        <div className="mcTstmp">
          <p className="tstmp">{timestamp}</p>
        </div>
      </div>
    </div>
  );
};

export default ChatItem;
