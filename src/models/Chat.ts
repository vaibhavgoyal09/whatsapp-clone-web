import Message from "./Message";

enum ChatType {
  oneToOne = 0,
  group = 1,
}

interface Chat {
  id: string;
  type: number;
  name: string;
  profileImageUrl: string | null;
  groupId: string | null;
  userIds: string[];
  lastMessage?: Message | null;
  typingUsersIds: string[];
}

export default Chat;
export { ChatType };
