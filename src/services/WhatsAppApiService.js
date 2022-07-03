import axios from "axios";
import ApiError from "../utils/ApiError";
import auth from "../utils/FirebaseConfig";
import { getIdToken } from "firebase/auth";

class WhatsAppApiService {
  SimpleRequest = axios.create({
    baseURL: "http://localhost:8000/api/v1/",
    timeout: 1000,
    headers: { "Content-Type": "application/json" },
    Accept: "application/json",
  });

  FileUploadRequest = axios.create({
    baseURL: "http://localhost:8000/api/v1/file/",
    timeout: 1000 * 60 * 2, // 2 Minutes
    headers: {
      "Content-Type": "multipart/form-data",
      Accept: "multipart/form-data",
    },
  });

  constructor() {
    let user = auth.currentUser;
    getIdToken(user)
      .then((token) => {
        console.log(token);
        this.SimpleRequest.interceptors.request.use((config) => {
          console.log(token);
          config.headers = { Authorization: `Bearer ${token}` };
          return config;
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  async createUser(request) {
    let file = new FormData();
    file.append("file", request.getProfilePhotoAsFile());
    let uploadImageRequest = await this.FileUploadRequest.post("/new", file);
    if (uploadImageRequest.status !== 200) {
      return new ApiError(
        uploadImageRequest.status,
        uploadImageRequest.data["detail"]
      );
    }

    let profilePhotoUrl = uploadImageRequest.data["url"];

    let userInfoSaveRequest = await this.SimpleRequest.post("/auth/register", {
      name: request.getName(),
      about: request.getAbout(),
      phone_number: request.getPhoneNumber(),
      profile_image_url: profilePhotoUrl,
    });
    if (userInfoSaveRequest.status === 200) {
      return userInfoSaveRequest.data;
    } else {
      return new ApiError(
        uploadImageRequest.status,
        uploadImageRequest.data["detail"]
      );
    }
  }
}

export default WhatsAppApiService;
