import axios from "axios";
import { useState } from "react";
import { createContext, useContext, useEffect, useRef } from "react";
import ApiError from "../utils/ApiError";
import { WhatsApi } from "../utils/Constants";
import { useAuth } from "./AuthContext";
import User from "../models/User";

export const AxiosContext = createContext(null);
export const useAxios = () => useContext(AxiosContext);
const AxiosInstanceProvider = ({ children }) => {
  const { getUserIdToken, currentUser } = useAuth();
  const [currentUserModel, setCurrentUserModel] = useState(null);

  let config = {
    baseURL: WhatsApi.BASE_URL,
    timeout: 1000 * 60 * 2, // 2 Minutes
    headers: {
      Accept: "*/*",
    },
  };

  const instanceRef = useRef(axios.create(config));

  useEffect(() => {
    getUserIdToken().then(async (token) => {
      if(token) {
        instanceRef.current.interceptors.request.use((config) => {
          config.headers = { Authorization: `Bearer ${token}` };
          return config;
        });
        try {
          let data = (
            await instanceRef.current.get(`${WhatsApi.GET_CURRENT_USER_INFO_URL}`)
          ).data;
          let user = new User(
            data.id,
            data.name,
            data.about,
            data.firebase_uid,
            data.phone_number,
            data.profile_image_url
          );
          setCurrentUserModel(user);
        }
        catch (axiosError) {
          console.log(axiosError);
        }
      }
    });
  }, [currentUser]);

  useEffect(() => {
    async function retrieveCurrentUser() {
      setTimeout(async () => {
        
      }, 2000);
    }
    retrieveCurrentUser();
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
    try {
      let response = await instanceRef.current.get(
        WhatsApi.SEARCH_USERS_BY_PHONE_NUMBER_URL,
        { params: { phone_number: searchQuery } }
      );
      return response.data;
    } catch (axiosError) {
      var message = "Check Your Internet Connection";
      if (axiosError.response.data) {
        message = axiosError.response.data["detail"];
      }
      throw Error(message);
    }
  }

  async function getMessagesForChat(chatId) {
    try {
      let result = await instanceRef.current.get(
        `${WhatsApi.GET_MESSAGES_FOR_CHAT_URL}/${chatId}`
      );
      return result.data;
    } catch (axiosError) {
      var message = "Check Your Internet Connection";
      if (axiosError.response.data) {
        message = axiosError.response.data["detail"];
      }
      throw Error(message);
    }
  }

  const value = {
    currentUserModel,
    checkIfUserExists,
    registerUser,
    getAllChats,
    searchUsers,
    getMessagesForChat,
  };

  return (
    <AxiosContext.Provider value={value}>{children}</AxiosContext.Provider>
  );
};

export default AxiosInstanceProvider;
