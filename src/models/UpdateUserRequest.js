class UpdateUserRequest {
   constructor(name, about, profileImageFile, shouldRemoveProfileImage) {
      this.name = name;
      this.about = about;
      this.profileImageFile = profileImageFile;
      this.shouldRemoveProfileImage = shouldRemoveProfileImage;
   }
}

export default UpdateUserRequest;