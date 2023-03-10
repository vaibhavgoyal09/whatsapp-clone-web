import IncomingCall from "./IncomingCall";
import Message from "./Message";
import TypingStatusChange from "./TypingStatusChange";

enum WsMessageType {
  chat_message = 0,
  typing_status_change = 1,
  incoming_call = 2,
  incoming_call_response = 3
}

interface WsClientMessage {
  type: number;
  message: Message | TypingStatusChange | IncomingCall;
}

export default WsClientMessage;
export { WsMessageType };
