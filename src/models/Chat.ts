import Message from './Message';

interface Chat {
  id: number;
  remoteUserId: number;
  remoteUserProfileImageUrl?: string;
  remoteUserName: string;
  lastMessage?: Message;
  unseenMessageCount: number;
}

export default Chat;
