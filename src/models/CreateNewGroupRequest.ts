interface CreateNewGroupRequest {
  name: string;
  desciption?: string;
  profileImageFile?: File;
  userIds: string[];
}

export default CreateNewGroupRequest;
