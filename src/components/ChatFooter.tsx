import React, { createRef, useEffect, useState } from "react";
import "../css/chatFooterStyle.css";

interface Props {
  onSendMessage: () => void;
  onMessageFieldValueChange: (value: string) => void;
}

const ChatFooter: React.FC<Props> = ({ onSendMessage, onMessageFieldValueChange }) => {

  const [messageText, setMessageText] = useState<string>("");
  const messageInputFieldRef = createRef<HTMLInputElement>();

  useEffect(() => {
    onMessageFieldValueChange(messageText);
  }, [messageText]);

  const handleMessageFieldValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessageText(event.target.value);
  }

  return (
    <div className="fcontnt">
      <span className="icon">
        <i className="fa-regular fa-face-smile" />
      </span>
      <span className="icon">
        <i className="fa-solid fa-paperclip" />
      </span>
      <input
        ref={messageInputFieldRef}
        type="text"
        placeholder="Type a message"
        className="input"
        onChange={handleMessageFieldValueChange}
      />
      <span
        className="icon"
        onClick={() => {
          onSendMessage();
          messageInputFieldRef.current!.value! = "";
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
