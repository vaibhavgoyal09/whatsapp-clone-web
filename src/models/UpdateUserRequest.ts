interface UpdateUserRequest {
  name?: string;
  about?: string;
  profileImageFile?: File;
  shouldRemoveProfileImage: boolean;
}

export default UpdateUserRequest;
