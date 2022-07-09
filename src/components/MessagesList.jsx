import "../css/messagesListStyle.css";
import ReceivedMessageItem from "./ReceivedMessageItem";
import SentMessageItem from "./SentMessageItem";

const MessagesList = ({ messagesList, currentUser }) => {
  return (
    <div className="contnt">
      <div className="listContainer">
        {messagesList.map((index, message) => {
          message.getSenderId() === currentUser.getId() ? (
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
