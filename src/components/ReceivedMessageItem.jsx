
import '../css/receivedMessageItemStyle.css';

const ReceivedMessageItem = ({ message }) => {

  let date = new Date(message.timestamp);
  let hours = date.getHours();
  let minutes = date.getMinutes().toString();
  let time = `${hours - 12}:${minutes.length === 1 ? `0${minutes}` : minutes} ${
    hours > 12 ? "PM" : "AM"
  }`;

  return (
    <div className="mrTopContainer">
      <div className="receivedMContainer">
        <div className="msgR">{message.text}</div>
        <div className="msgRTimestamp unselectable">{time}</div>
      </div>
    </div>
  );
};

export default ReceivedMessageItem;
