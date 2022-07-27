import User from "./User";

interface Group {
  id: string;
  name: string;
  profileImageUrl: string | null;
  users: User[];
  adminId: string;
}

export default Group;
