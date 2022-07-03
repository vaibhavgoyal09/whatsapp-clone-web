export default class CreateUserRequest {
  constructor(name, about, phoneNumber, profilePhotoAsFile) {
    this.name = name;
    this.about = about;
    this.phoneNumber = phoneNumber;
    this.profilePhotoAsFile = profilePhotoAsFile;
  }

  getName() {
    return this.name;
  }

  getAbout() {
    return this.about;
  }

  getPhoneNumber() {
    return this.phoneNumber;
  }

  getProfilePhotoAsFile() {
    return this.profilePhotoAsFile;
  }
}
