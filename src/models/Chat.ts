import Message from "./Message";
import User from "./User";

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
  users: User[];
  lastMessage?: Message | null;
}

export default Chat;
export { ChatType };
