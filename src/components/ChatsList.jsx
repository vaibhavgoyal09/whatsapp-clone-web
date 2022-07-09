import ChatItem from "./ChatItem";
import '../css/chatListStyle.css';

const ChatsList = ({chats, onChatClicked}) => {
  return (
    <div className="chats">
      {chats.map((chat, index) => (
        <ChatItem
          key={index}
          chat={chat}
          onChatClick={() => onChatClicked(chats[index])}
        />
      ))}
    </div>
  );
};

export default ChatsList;
