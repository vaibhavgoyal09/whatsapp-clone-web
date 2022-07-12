import "../css/sentMessageItemStyle.css";

const SentMessageItem = ({ message }) => {
  let date = new Date(message.timestamp);
  let hours = date.getHours();
  let minutes = date.getMinutes().toString();
  let time = `${hours - 12}:${minutes.length === 1 ? `0${minutes}` : minutes} ${
    hours > 12 ? "PM" : "AM"
  }`;

  return (
    <div className="msTopContainer">
      <div className="sentMContainer">
        <div className="msg">{message.text}</div>
        <div className="msgTimestamp unselectable">{time}</div>
      </div>
    </div>
  );
};

export default SentMessageItem;
