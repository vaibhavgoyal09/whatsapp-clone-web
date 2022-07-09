import { useRef } from "react";
import "../css/chatItemStyle.css";

const ChatItem = ({ chat, onChatClick }) => {

  const contentRef = useRef();

  if (!chat) {
    return null;
  }

  console.log(chat);

  const message = chat.getLastMessage();
  var messageText = "Tap to start chatting";
  var timestamp = "";
  if (message !== null && message !== undefined) {
    if (message.getType() === "image") {
      messageText = "Image";
    } else if (message.getType() === "video") {
      messageText = "Video";
    } else if (message.getType() === "text") {
      messageText = message.getText();
    }
  }

  return (
    <div className="cn" ref={contentRef} onClick={() => onChatClick()}>
      <img
          src={
            chat.getRemoteUserProfileImageUrl()
              ? chat.getRemoteUserProfileImageUrl()
              : "avatar.png"
          }
          alt="user profile"
          className="avatar"
        />
      <div className="infoContainer" onClick={() => contentRef.current.click()}>
        <div className="unamec">
          <p className="uname unselectable">{chat.getRemoteUserName()}</p>
          <p className="umsg unselectable">{messageText}</p>
        </div>
        <div className="mcTstmp">
          <div className="mctnr">
            <p className="mc">{chat.getUnseenMessageCount()}</p>
          </div>
          <p className="tstmp">{timestamp}</p>
        </div>
      </div>
    </div>
  );
};

export default ChatItem;
