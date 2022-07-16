interface User {
  id: number;
  name: string;
  about?: string;
  firebaseUid: string;
  phoneNumber: string;
  profileImageUrl?: string;
}

export default User;
