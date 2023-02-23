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

const ChatItem: React.FC<Props> = ({chat, onChatClick, isSelected }) => {
  const contentRef = createRef<HTMLDivElement>();
  const [typingStatus, setTypingStatus] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("Tap to start Chatting");
  const [timestamp, setTimestamp] = useState("");

  useEffect(() => {
    if (chat.type === ChatType.oneToOne) {
      if (chat.typingUsersIds.length >= 1) {
        console.log("typing...")
        setTypingStatus("typing...");
      } else {
        console.log("not typing...")
        setTypingStatus(null);
      }
    }
  }, []);

  useEffect(() => {
    const message = chat?.lastMessage;
    if (message) {
      let date = moment.unix(message.timestamp / 1000).format("DD MMM - LT");
      setTimestamp(date);
      if (message.type === MessageType.image) {
        setMessageText("Image");
      } else if (message.type === MessageType.video) {
        setMessageText("Video");
      } else if (message.type === MessageType.text) {
        setMessageText(message.text ? message.text : "Tap to start chatting");
      }
    }
  });

  if (!chat) {
    return null;
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
