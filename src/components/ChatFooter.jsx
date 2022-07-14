import { useState } from "react";
import "../css/chatFooterStyle.css";

const ChatFooter = ({ onSendMessage }) => {
  const [messageText, setMessageText] = useState("");
  const sendMessage = () => {
    onSendMessage(messageText);
  };
  const handleMessageTextChange = (event) => {
    setMessageText(event.target.value);
  };

  return (
    <div className="fcontnt">
      <span className="icon">
        <i className="fa-regular fa-face-smile" />
      </span>
      <span className="icon">
        <i className="fa-solid fa-paperclip" />
      </span>
      <input
        type="text"
        placeholder="Type a message"
        value={messageText}
        onChange={handleMessageTextChange}
        className="input"
      />
      <span
        className="icon"
        onClick={() => {
          sendMessage();
        }}
      >
        <i className="fa-solid fa-paper-plane" />
      </span>
      <span className="icon">
        <i className="fa-solid fa-microphone" />
      </span>
    </div>
  );
};

export default ChatFooter;
