import CallUserRequest from "./CallUserRequest";
import Message from "./Message";
import TypingStatusChange from "./TypingStatusChange";

enum WsMessageType {
  chat_message = 0,
  typing_status_change = 1,
  call_user = 2,
}

interface WsClientMessage {
  type: number;
  message: Message | TypingStatusChange | CallUserRequest;
}

export default WsClientMessage;
export { WsMessageType };
