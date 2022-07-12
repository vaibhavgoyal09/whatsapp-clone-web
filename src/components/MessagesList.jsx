import "../css/messagesListStyle.css";
import ReceivedMessageItem from "./ReceivedMessageItem";
import SentMessageItem from "./SentMessageItem";

const MessagesList = ({ messagesList, currentUserId }) => {
  return (
    <div className="listContainer">
      {messagesList.map((message, index) =>
        (message.senderId === currentUserId ? (
          <SentMessageItem message={message} key={index} />
        ) : (
          <ReceivedMessageItem message={message} key={index} />
        ))
      )}
    </div>
  );
};

export default MessagesList;
