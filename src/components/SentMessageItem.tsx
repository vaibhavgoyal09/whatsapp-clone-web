import "../css/sentMessageItemStyle.css";
import Message from "../models/Message";
import moment from "moment";

const SentMessageItem = ({ message }: { message: Message }) => {
  let time: string = moment
    .unix(message.timestamp / 1000)
    .format("DD MMM - LT");

  return (
    <div className="msTopContainer">
      <div className="sentMContainer">
        {message.mediaUrl ? (
          <img id="msgImg" src={message.mediaUrl} alt="Photo"></img>
        ) : null}
        <div className="msg">{message.text}</div>
        <div className="msgTimestamp unselectable">{time}</div>
      </div>
    </div>
  );
};

export default SentMessageItem;
