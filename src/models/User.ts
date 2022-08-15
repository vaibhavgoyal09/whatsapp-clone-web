enum OnlineStatus {
  online = 0,
  offline = 1,
  typing = 2,
}

interface User {
  id: string;
  name: string;
  about?: string;
  firebaseUid: string;
  phoneNumber: string;
  profileImageUrl?: string;
  onlineStatus: number;
  lastOnlineAt: number;
}

export default User;
export { OnlineStatus };
