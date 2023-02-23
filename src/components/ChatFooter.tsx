import React, { createRef, useEffect, useState } from "react";
import "../css/chatFooterStyle.css";
import debounce from "lodash/debounce";

interface Props {
  onSendMessage: () => void;
  onMessageFieldValueChange: (value: string) => void;
  onTypingStatusChange: (isTyping: boolean) => void;
  onAttachmentClicked: () => void;
}

const ChatFooter: React.FC<Props> = ({
  onSendMessage,
  onMessageFieldValueChange,
  onTypingStatusChange,
  onAttachmentClicked,
}) => {
  const [messageText, setMessageText] = useState<string>("");
  const messageInputFieldRef = createRef<HTMLInputElement>();
  const [isTyping, setIsTyping] = useState<boolean>(false);

  useEffect(() => {
    onMessageFieldValueChange(messageText);
  }, [messageText]);

  useEffect(() => {
    onTypingStatusChange(isTyping);
  }, [isTyping]);

  const handleEnterKeyPressed = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSendMessage();
      messageInputFieldRef.current!.value! = "";
    }
  };

  const handleMessageFieldValueChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsTyping(true);
    setMessageText(event.target.value);
    handleIsTypingChange();
  };

  const handleIsTypingChange = debounce(() => {
    setIsTyping(false);
  }, 4000);

  return (
    <div className="fcontnt">
      <span className="icon nt-allow">
        <i className="fa-regular fa-face-smile" />
      </span>
      <span className="icon" onClick={() => onAttachmentClicked()}>
        <i className="fa-solid fa-paperclip" />
      </span>
      <input
        ref={messageInputFieldRef}
        type="text"
        placeholder="Type a message"
        className="input"
        onKeyDown={handleEnterKeyPressed}
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
