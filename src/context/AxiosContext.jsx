import axios from "axios";
import { createContext, useContext, useEffect, useRef } from "react";
import ApiError from "../utils/ApiError";
import { WhatsApi } from "../utils/Constants";
import { useAuth } from "./AuthContext";

export const AxiosContext = createContext({
  checkIfUserExists: () => Promise,
  registerUser: () => Promise,
});
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
    console.log('Use effect called');
    getUserIdToken()
      .then((token) => {
        instanceRef.current.interceptors.request.use((request) => {
          request.headers = { Authorization: `Bearer ${token}` };
          return request;
        });
      })
      .catch((e) => {
        console.log(e);
      });
  });

  function checkIfUserExists(phoneNumber) {
    console.log(phoneNumber);
    return new Promise((resolve, reject) => {
      instanceRef.current
        .get(`${WhatsApi.CHECK_USER_SIGNING_IN_URL}${phoneNumber}`)
        .then((result) => {
          resolve(result.data);
        })
        .catch((axios_error) => {
          reject(new ApiError(axios_error.status));
        });
    });
  }

  function registerUser(request) {
    return new Promise((resolve, reject) => {
      let file = new FormData();
      file.append("file", request.getProfilePhotoAsFile());
      instanceRef.current
        .post(`${WhatsApi.UPLOAD_FILE_URL}`, file)
        .then((result) => {
          console.log(result);
          let profilePhotoUrl = result.data['url'];
          console.log(profilePhotoUrl);

          instanceRef.current
            .post(`${WhatsApi.REGISTER_USER_URL}`, {
              name: request.getName(),
              about: request.getAbout(),
              phone_number: request.getPhoneNumber(),
              profile_image_url: profilePhotoUrl,
            })
            .then((result) => {
              resolve(result.data);
            })
            .catch((axios_error) => {
              reject(new ApiError(axios_error.status));
            });
        })
        .catch((axios_error) => {
          reject(new ApiError(axios_error.status));
        });
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
