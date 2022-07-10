import { ReactComponent as LeftTail } from '../assets/left_tail.svg';
import '../css/receivedMessageItemStyle.css';

const ReceivedMessageItem = ({ message }) => {
  return (
    <div className="">{message.getText()}</div>
  );
};

export default ReceivedMessageItem;
