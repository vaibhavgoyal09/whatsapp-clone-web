import axios from "axios";
import { createContext, useContext, useEffect, useRef } from "react";
import { useAuth } from "./AuthContext";
import { WhatsApi } from "../utils/Constants";
import ApiError from "../utils/ApiError";

export const AxiosContext = createContext(null);
export const useAxios = () => useContext(AxiosContext);
const AxiosInstanceProvider = ({ children }) => {
  const { getUserIdToken } = useAuth();

  let config = {
    baseURL: WhatsApi.BASE_URL,
    timeout: 1000 * 60 * 2, // 2 Minutes
    headers: {
      Accept: "*/*",
    },
  };

  const instanceRef = useRef(axios.create(config));

  useEffect(() => {
    getUserIdToken()
      .then((token) => {
        instanceRef.current.interceptors.request.use((request) => {
          request.headers({ Authorization: `Bearer ${token}` });
          return request;
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  function checkIfUserExists(phoneNumber) {
    return new Promise((resolve, reject) => {
      try {
        instanceRef.current
          .get(`${WhatsApi.CHECK_USER_SIGNING_IN_URL}/${phoneNumber}`)
          .then((data) => {
            resolve(data);
          });
      } catch (axios_error) {
        if (axios_error.data !== null) {
          reject(new ApiError(axios_error.status, axios_error.data["detail"]));
        } else {
          reject(new ApiError(axios_error.status, axios_error.message));
        }
      }
    });
  }

  function registerUser(request) {
    return new Promise((resolve, reject) => {
      try {
        let file = new FormData();
        file.append("file", request.getProfilePhotoAsFile());
        instanceRef.current
          .post(`${WhatsApi.UPLOAD_FILE_URL}`, file)
          .then((data) => {
            let profilePhotoUrl = data;

            instanceRef.current
              .post(`${WhatsApi.REGISTER_USER_URL}`, {
                name: request.getName(),
                about: request.getAbout(),
                phone_number: request.getPhoneNumber(),
                profile_image_url: profilePhotoUrl,
              })
              .then((data) => {
                resolve(data);
              });
          });
      } catch (axios_error) {
        if (axios_error.data !== null) {
          reject(new ApiError(axios_error.status, axios_error.data["detail"]));
        } else {
          reject(new ApiError(axios_error.status, axios_error.message));
        }
      }
    });
  }

  const value = {
    checkIfUserExists,
    registerUser,
  };

  return (
    <AxiosContext.Provider value={value}>{children}</AxiosContext.Provider>
  );
};

export default AxiosInstanceProvider;
