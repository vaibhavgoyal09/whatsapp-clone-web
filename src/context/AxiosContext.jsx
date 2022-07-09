import axios from "axios";
import { createContext, useContext, useEffect, useRef } from "react";
import ApiError from "../utils/ApiError";
import { WhatsApi } from "../utils/Constants";
import { useAuth } from "./AuthContext";

export const AxiosContext = createContext({
  checkIfUserExists: () => Promise,
  registerUser: () => Promise,
  getAllChats: () => Promise,
  searchUsers: () => Promise,
});
export const useAxios = () => useContext(AxiosContext);
const AxiosInstanceProvider = ({ children }) => {
  const { getUserIdToken, currentUser } = useAuth();

  let config = {
    baseURL: WhatsApi.BASE_URL,
    timeout: 1000 * 60 * 2, // 2 Minutes
    headers: {
      Accept: "*/*",
    },
  };

  const instanceRef = useRef(axios.create(config));

  useEffect(() => {
    console.log("Use effect called");
    getUserIdToken()
      .then((token) => {
        console.log(token);
        if (token) {
          instanceRef.current.interceptors.request.use((request) => {
            request.headers = { Authorization: `Bearer ${token}` };
            return request;
          });
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }, [currentUser]);

  async function checkIfUserExists(phoneNumber) {
    try {
      let response = await instanceRef.current.get(
        `${WhatsApi.CHECK_USER_SIGNING_IN_URL}/${phoneNumber}`
      );
      return response.data;
    } catch (axiosError) {
      console.log(axiosError);
      var message = "Check Your Internet Connection";
      if (axiosError.response.data) {
        message = axiosError.response.data["detail"];
      }
      throw Error(message);
    }
  }

  async function registerUser(request) {
    try {
      let file = new FormData();
      file.append("file", request.getProfilePhotoAsFile());
      let fileUploadResponse = await instanceRef.current.post(
        `${WhatsApi.UPLOAD_FILE_URL}`,
        file
      );

      let profileImageUrl = fileUploadResponse.data["url"];

      let registerUserResponse = await instanceRef.current.post(
        `${WhatsApi.REGISTER_USER_URL}`,
        {
          name: request.getName(),
          about: request.getAbout(),
          phone_number: request.getPhoneNumber(),
          profile_image_url: profileImageUrl,
        }
      );

      return registerUserResponse.data;
    } catch (axiosError) {
      var message = "Check Your Internet Connection";
      if (axiosError.response.data) {
        message = axiosError.response.data["detail"];
      }
      throw Error(message);
    }
  }

  async function getAllChats() {
    try {
      let response = await instanceRef.current.get(WhatsApi.GET_ALL_CHATS_URL);
      return response.data;
    } catch (axiosError) {
      var message = "Check Your Internet Connection";
      if (axiosError.response.data) {
        message = axiosError.response.data["detail"];
      }
      throw Error(message);
    }
  }

  async function searchUsers(searchQuery) {
    try{
      let response = await instanceRef.current.get(WhatsApi.SEARCH_USERS_BY_PHONE_NUMBER_URL, { params: { phone_number: searchQuery } })
      return response.data;
    }
    catch(axiosError) {
      var message = "Check Your Internet Connection";
      if (axiosError.response.data) {
        message = axiosError.response.data["detail"];
      }
      throw Error(message);
    }
  }

  const value = {
    checkIfUserExists,
    registerUser,
    getAllChats,
    searchUsers
  };

  return (
    <AxiosContext.Provider value={value}>{children}</AxiosContext.Provider>
  );
};

export default AxiosInstanceProvider;
