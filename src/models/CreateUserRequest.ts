interface CreateUserRequest {
  name: string;
  about?: string;
  phoneNumber: string;
  profileImageFile?: File;
}

export default CreateUserRequest;
