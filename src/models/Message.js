class Message {
  constructor(
    id,
    senderId,
    type,
    text,
    mediaUrl,
    chatId,
    timestamp
  ) {
    this.id = id;
    this.senderId = senderId;
    this.type = type;
    this.text = text;
    this.mediaUrl = mediaUrl;
    this.timestamp = timestamp;
    this.chatId = chatId;
  }
}

export default Message;
