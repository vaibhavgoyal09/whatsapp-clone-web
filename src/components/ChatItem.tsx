import React, { createRef } from "react";
import "../css/chatItemStyle.css";
import Chat from "../models/Chat";

interface Props {
  chat: Chat;
  onChatClick: () => void;
  isSelected: boolean;
}

const ChatItem: React.FC<Props> = ({ chat, onChatClick, isSelected }) => {
  const contentRef = createRef<HTMLDivElement>();

  if (!chat) {
    return null;
  }

  const message = chat.lastMessage;
  let messageText: string = "Tap to start chatting";

  var timestamp = "";
  if (message !== null && message !== undefined) {
    let date = new Date(message.timestamp);
    let hours = date.getHours();
    let minutes = date.getMinutes().toString();
    timestamp = `${hours - 12}:${
      minutes.length === 1 ? `0${minutes}` : minutes
    } ${hours > 12 ? "PM" : "AM"}`;

    if (message.type === 1) {
      messageText = "Image";
    } else if (message.type === 2) {
      messageText = "Video";
    } else if (message.type === 0) {
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
        src={
          chat.remoteUserProfileImageUrl
            ? chat.remoteUserProfileImageUrl
            : "avatar.png"
        }
        alt="user profile"
        className="avatar"
      />
      <div className="infoContainer">
        <div className="unamec">
          <p className="uname unselectable">{chat.remoteUserName}</p>
          <p className="umsg unselectable">{messageText}</p>
        </div>
        <div className="mcTstmp">
          {chat.unseenMessageCount > 0 ? (
            <div className="mctnr">
              <p className="mc">{chat.unseenMessageCount}</p>
            </div>
          ) : null}
          <p className="tstmp">{timestamp}</p>
        </div>
      </div>
    </div>
  );
};

export default ChatItem;
