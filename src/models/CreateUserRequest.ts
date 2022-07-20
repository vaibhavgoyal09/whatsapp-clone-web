interface CreateUserRequest {
  name: string;
  about: string | null;
  phone_number: string;
  profile_image_url: string | null;
}

export default CreateUserRequest;
