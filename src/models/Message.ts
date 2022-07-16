interface Message {
  id: number;
  senderId: number;
  type: number;
  text?: string;
  mediaUrl?: string;
  chatId: number;
  timestamp: number;
}

export default Message;
