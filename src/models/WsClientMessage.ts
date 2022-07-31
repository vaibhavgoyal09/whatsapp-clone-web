import Message from "./Message";
import TypingStatusChange from "./TypingStatusChange";


enum WsMessageType {
    chat_message = 0,
    typing_status_change = 1
}

interface WsClientMessage {
    type: number;
    message: Message | TypingStatusChange
}


export default WsClientMessage;
export { WsMessageType };
