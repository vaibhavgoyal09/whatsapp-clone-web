interface Message {
  id: string;
  senderId: string;
  type: number;
  text: string;
  mediaUrl: string | null;
  chatId: string;
  timestamp: number;
}

enum MessageType {
  text = 0,
  image = 1,
  video = 2
}

export default Message;
export { MessageType };
