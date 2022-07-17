import { createRef, useRef } from "react";
import "../css/chatFooterStyle.css";

interface Props {
  onSendMessage: (text?: string) => void;
}

const ChatFooter: React.FC<Props> = ({ onSendMessage }) => {
  const messageFieldRef = createRef<HTMLInputElement>();

  return (
    <div className="fcontnt">
      <span className="icon">
        <i className="fa-regular fa-face-smile" />
      </span>
      <span className="icon">
        <i className="fa-solid fa-paperclip" />
      </span>
      <input
        ref={messageFieldRef}
        type="text"
        placeholder="Type a message"
        className="input"
      />
      <span
        className="icon"
        onClick={() => {
          onSendMessage(messageFieldRef?.current?.value);
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
