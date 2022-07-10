import { ReactComponent as LeftTail } from '../assets/left_tail.svg';
import '../css/receivedMessageItemStyle.css';

const ReceivedMessageItem = ({ message }) => {
  return (
    <div className="messageRightBox">
      <div className="messageContent">
        <span className='ltail'><LeftTail/></span>
        <p className="text">{ message.getText() }</p>
        <p className="timestamp">{message.getTimestamp()}</p>
      </div>
    </div>
  );
};

export default ReceivedMessageItem;
