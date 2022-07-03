import axios from "axios";
import ApiError from "../utils/ApiError";
import auth from "../utils/FirebaseConfig";
import { getIdToken } from "firebase/auth";

class WhatsAppApiService {
  apiClientWithAuthHeader = axios.create({
    baseURL: "http://localhost:8000/api/v1/",
    timeout: 1000 * 60 * 2, // 2 Minutes
    headers: {
      Accept: "*/*",
    },
  });

  apiClientWithoutAuthHeader = axios.create({
    baseURL: "http://localhost:8000/api/v1/",
    timeout: 1000 * 60 * 2, // 2 Minutes
    headers: {
      Accept: "*/*",
    },
  });

  constructor() {
    let user = auth.currentUser;
    if (user !== null && user !== undefined) {
      getIdToken(user)
        .then((token) => {
          console.log(token);
          this.apiClientWithAuthHeader.interceptors.request.use((config) => {
            console.log(token);
            config.headers = { Authorization: `Bearer ${token}` };
            return config;
          });
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }

  async checkIfUserExists(phoneNumber) {
    try {
      let response = await this.apiClientWithoutAuthHeader.get(
        `/user/${phoneNumber}`
      );
      return response.data;
    } catch (axios_error) {
      return new ApiError(axios_error.status, axios_error.data["detail"]);
    }
  }

  async createUser(request) {
    try {
      let file = new FormData();
      file.append("file", request.getProfilePhotoAsFile());
      let uploadImageRequest = await this.apiClientWithAuthHeader.post(
        "/file/new",
        file
      );

      let profilePhotoUrl = uploadImageRequest.data["url"];

      let userInfoSaveRequest = await this.apiClientWithAuthHeader.post(
        "/auth/register",
        {
          name: request.getName(),
          about: request.getAbout(),
          phone_number: request.getPhoneNumber(),
          profile_image_url: profilePhotoUrl,
        }
      );
      return userInfoSaveRequest.data;
    } catch (axios_error) {
      return new ApiError(axios_error.status, axios_error.data["detail"]);
    }
  }
}

export default WhatsAppApiService;
