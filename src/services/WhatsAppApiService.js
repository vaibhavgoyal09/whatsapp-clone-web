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
}

export default WhatsAppApiService;
