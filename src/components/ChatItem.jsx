import { useRef } from "react";
import "../css/chatItemStyle.css";

const ChatItem = ({ chat, onChatClick, isSelected }) => {
  const contentRef = useRef();

  if (!chat) {
    return null;
  }

  const message = chat.lastMessage;
  var messageText = "Tap to start chatting";

  var timestamp = "";
  if (message !== null && message !== undefined) {
    let date = new Date(message.getTimestamp());
    let hours = date.getHours();
    let minutes = date.getMinutes().toString();
    timestamp = `${hours - 12}:${
      minutes.length === 1 ? `0${minutes}` : minutes
    } ${hours > 12 ? "PM" : "AM"}`;

    if (message.getType() === "image") {
      messageText = "Image";
    } else if (message.getType() === "video") {
      messageText = "Video";
    } else if (message.getType() === "text") {
      messageText = message.getText();
    }
  }

  return (
    <div className={isSelected ? "cn cnWithBg" : "cn"} ref={contentRef} onClick={() => onChatClick()}>
      <img
        src={
          chat.getRemoteUserProfileImageUrl()
            ? chat.getRemoteUserProfileImageUrl()
            : "avatar.png"
        }
        alt="user profile"
        className="avatar"
      />
      <div className="infoContainer">
        <div className="unamec">
          <p className="uname unselectable">{chat.getRemoteUserName()}</p>
          <p className="umsg unselectable">{messageText}</p>
        </div>
        <div className="mcTstmp">
          {chat.unseenMessageCount > 0 ? (
            <div className="mctnr">
              <p className="mc">{chat.getUnseenMessageCount()}</p>
            </div>
          ) : null}
          <p className="tstmp">{timestamp}</p>
        </div>
      </div>
    </div>
  );
};

export default ChatItem;
