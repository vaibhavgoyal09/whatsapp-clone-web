class Message {
  constructor(
    id,
    senderId,
    type,
    text,
    mediaUrl,
    timestamp
  ) {
    this.id = id;
    this.senderId = senderId;
    this.type = type;
    this.text = text;
    this.mediaUrl = mediaUrl;
    this.timestamp = timestamp;
  }

  getId() {
    return this.id;
  }

  getSenderId() {
    return this.senderId;
  }

  getType() {
    return this.type;
  }

  getText() {
    return this.text;
  }

  getMediaUrl() {
    return this.mediaUrl;
  }

  getTimestamp() {
    return this.timestamp;
  }
}

export default Message;
