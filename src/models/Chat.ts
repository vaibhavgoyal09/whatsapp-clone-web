import Message from './Message';

interface Chat {
  id: number;
  remoteUserId: number;
  remoteUserProfileImageUrl?: string;
  remoteUserName: string;
  lastMessage?: Message | null;
  unseenMessageCount: number;
}

export default Chat;
