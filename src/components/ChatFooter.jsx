import "../css/chatFooterStyle.css";

const ChatFooter = () => {
  return (
    <div className="fcontnt">
      <span class="icon">
        <i class="fa-regular fa-face-smile"></i>
      </span>
      <span class="icon">
        <i class="fa-solid fa-paperclip"></i>
      </span>
      <input type="text" placeholder="Type a message" class="input" />
      <span class="icon">
        <i class="fa-solid fa-paper-plane"></i>
      </span>
      <span class="icon">
        <i class="fa-solid fa-microphone"></i>
      </span>
    </div>
  );
};

export default ChatFooter;
