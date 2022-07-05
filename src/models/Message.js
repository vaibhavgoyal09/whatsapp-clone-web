class Message {
  constructor(
    id,
    currentUserId,
    remoteUserId,
    type,
    text,
    mediaUrl,
    timestamp
  ) {
    this.id = id;
    this.currentUserId = currentUserId;
    this.remoteUserId = remoteUserId;
    this.type = type;
    this.text = text;
    this.mediaUrl = mediaUrl;
    this.timestamp = timestamp;
  }

  getId() {
    return this.id;
  }

  getCurrentUserId() {
    return this.currentUserId;
  }

  getRemoteUserId() {
    return this.remoteUserId;
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
