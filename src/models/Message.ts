interface Message {
  id: string;
  senderId: string;
  type: number;
  text?: string;
  mediaUrl?: string;
  chatId: string;
  timestamp: number;
}

export default Message;
