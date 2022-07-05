class Chat {
  constructor(
    id,
    remoteUserId,
    remoteUserProfileImageUrl,
    remoteUserName,
    lastMessage,
    unseenMessageCount
  ) {
    this.id = id;
    this.remoteUserId = remoteUserId;
    this.remoteUserProfileImageUrl = remoteUserProfileImageUrl;
    this.remoteUserName = remoteUserName;
    this.lastMessage = lastMessage;
    this.unseenMessageCount = unseenMessageCount;
  }

  getId() {
    return this.id;
  }

  getRemoteUserName() {
    return this.remoteUserName;
  }

  getRemoteUserId() {
    return this.remoteUserId;
  }

  getRemoteUserProfileImageUrl() {
    return this.remoteUserProfileImageUrl;
  }

  getLastMessage() {
    return this.lastMessage;
  }

  getUnseenMessageCount() {
    return this.unseenMessageCount;
  }
}

export default Chat;
