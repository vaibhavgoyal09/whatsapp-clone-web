class User {
  constructor(id, name, about, firebaseUid, phoneNumber, profileImageUrl) {
    this.id = id;
    this.name = name;
    this.about = about;
    this.firebaseUid = firebaseUid;
    this.phoneNumber = phoneNumber;
    this.profileImageUrl = profileImageUrl;
  }

  getId() {
    return this.id;
  }

  getName() {
    return this.name;
  }

  getAbout() {
    return this.about;
  }

  getFirebaseUid() {
    return this.firebaseUid;
  }

  getPhoneNumber() {
    return this.phoneNumber;
  }

  getProfileImageUrl() {
    return this.profileImageUrl;
  }
}

export default User;
