import moment from "moment";
import "../css/receivedMessageItemStyle.css";
import Message from "../models/Message";

const ReceivedMessageItem = ({ message }: { message: Message }) => {
  let time: string = moment
    .unix(message.timestamp / 1000)
    .format("DD MMM - LT");

  return (
    <div className="mrTopContainer">
      <div className="receivedMContainer">
        {message.mediaUrl ? (
          <img id="msgRImg" src={message.mediaUrl} alt="Photo"></img>
        ) : null}
        <div className="msgR">{message.text}</div>
        <div className="msgRTimestamp unselectable">{time}</div>
      </div>
    </div>
  );
};

export default ReceivedMessageItem;
