import { useEffect } from "react";
import { useState } from "react";
import "../css/chatFooterStyle.css";

const ChatFooter = ({ onSendMessage, messageText, onMessageTextChange }) => {

  const [text, setText] = useState("");

  const handleMessageTextChange = (event) => {
    setText(event.target.value);
  };

  useEffect(() => {
    onMessageTextChange(text);
  }, [text]);

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
          onSendMessage(messageText);
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
