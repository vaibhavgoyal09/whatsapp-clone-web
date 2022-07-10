import "../css/messagesListStyle.css";
import ReceivedMessageItem from "./ReceivedMessageItem";
import SentMessageItem from "./SentMessageItem";

const MessagesList = ({ messagesList, currentUserId }) => {
  return (
    <div className="contnt">
      <div className="listContainer">
        {messagesList.map((message, index) => {
          console.log(message);
          message.getSenderId() === currentUserId ? (
            <SentMessageItem key={index} message={message}/>
          ) : (
            <ReceivedMessageItem key={index} message={message} />
          );
        })}
      </div>
    </div>
  );
};

export default MessagesList;
