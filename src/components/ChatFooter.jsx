import "../css/chatFooterStyle.css";

const ChatFooter = () => {
  return (
    <div className="fcontnt">
      <span className="icon">
        <i className="fa-regular fa-face-smile"></i>
      </span>
      <span className="icon">
        <i className="fa-solid fa-paperclip"></i>
      </span>
      <input type="text" placeholder="Type a message" className="input" />
      <span className="icon">
        <i className="fa-solid fa-paper-plane"></i>
      </span>
      <span className="icon">
        <i className="fa-solid fa-microphone"></i>
      </span>
    </div>
  );
};

export default ChatFooter;
