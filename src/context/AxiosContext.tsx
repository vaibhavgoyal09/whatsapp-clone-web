import axios from "axios";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import User from "../models/User";
import { WhatsApi } from "../utils/Constants";
import { useAuth } from "./AuthContext";

interface AxiosContextInterface {
  currentUserModel: User | null;
  accessToken: string | null;
  updateCurrentUserModelState: (
    name?: string,
    about?: string,
    profileImageUrl?: string
  ) => void;
  postRequest: <T = any>(
    requestBody: any,
    params: object | null,
    requestPath: string
  ) => Promise<T>;
  putRequest: <T = any>(
    requestBody: any,
    params: object | null,
    requestPath: string
  ) => Promise<T>;
  uploadFile: (file: File) => Promise<string>;
  getRequest: <T = any>(requestPath: string, params: object | null) => Promise<T>;
}

export const AxiosContext = createContext<AxiosContextInterface | null>(null);
export const useAxios = () => useContext(AxiosContext);
const AxiosInstanceProvider = ({ children }: { children: ReactNode }) => {
  const auth = useAuth()!;
  const [currentUserModel, setCurrentUserModel] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null); // Just a fake token

  let config = {
    baseURL: WhatsApi.BASE_URL,
    timeout: 1000 * 60 * 2, // 2 Minutes
    headers: {
      Accept: "*/*",
    },
  };

  const instanceRef = useRef(axios.create(config));

  useEffect(() => {
    auth.getUserIdToken().then((token) => {
      if (token) {
        setAccessToken(token.substring(8, 5));
        instanceRef.current.interceptors.request.use((config) => {
          config.headers = { Authorization: `Bearer ${token}` };
          return config;
        });
      }
    });
  }, [auth.currentUser]);

  useEffect(() => {
    async function retrieveCurrentUser() {
      if (accessToken) {
        try {
          let data = (
            await instanceRef.current.get(
              `${WhatsApi.GET_CURRENT_USER_INFO_URL}`
            )
          ).data;
          let user = {
            id: data.id,
            name: data.name,
            about: data.about,
            firebaseUid: data.firebase_uid,
            phoneNumber: data.phone_number,
            profileImageUrl: data.profile_image_url,
          };
          setCurrentUserModel(user);
        } catch (axiosError) {
          console.log(axiosError);
        }
      }
    }
    retrieveCurrentUser();
  }, [accessToken, auth.isUserLoggedIn]);

  async function safeApiRequest<T>(request: () => Promise<T>) {
    try {
      return await request();
    } catch (axiosError: any) {
      let message = "Check Your Internet Connection";
      if (axiosError.response.data) {
        message = axiosError.response.data["detail"];
      }
      throw Error(message);
    }
  }

  function updateCurrentUserModelState(
    name?: string,
    about?: string,
    profileImageUrl?: string
  ) {
    setCurrentUserModel({
      id: currentUserModel!.id,
      name: name ? name : currentUserModel!.name,
      about: about ? about : currentUserModel!.about,
      firebaseUid: currentUserModel!.firebaseUid,
      phoneNumber: currentUserModel!.phoneNumber,
      profileImageUrl: profileImageUrl
        ? profileImageUrl
        : currentUserModel!.profileImageUrl,
    });
  }

  async function uploadFile(file: File) {
    return await safeApiRequest<string>(async () => {
      let formData = new FormData();
      formData.append("file", file);
      let fileUploadResponse = await instanceRef.current.post(
        `${WhatsApi.UPLOAD_FILE_URL}`,
        formData
      );
      return fileUploadResponse.data["url"];
    });
  }

  async function postRequest<T = any>(
    requestBody: any,
    params: object | null = null,
    requestPath: string
  ): Promise<T> {
    return await safeApiRequest<T>(async () => {
      let response = await instanceRef.current.post(
        `${requestPath}`,
        requestBody,
        {
          params: params,
        }
      );
      return response.data ? response.data : null;
    });
  }

  async function getRequest<T = any>(
    requestPath: string,
    params: object | null
  ): Promise<T> {
    return await safeApiRequest<T>(async () => {
      let response = await instanceRef.current.get(requestPath, {
        params: params,
      });
      return response.data ? response.data : null;
    });
  }

  async function putRequest<T = any>(
    requestPath: string,
    params: object | null,
    requestBody: any
  ): Promise<T> {
    return await safeApiRequest<T>(async () => {
      let response = await instanceRef.current.put(requestPath, requestBody, {
        params: params,
      });
      return response.data ? response.data : null;
    });
  }

  const value: AxiosContextInterface = {
    currentUserModel,
    accessToken,
    postRequest,
    uploadFile,
    getRequest,
    updateCurrentUserModelState,
    putRequest,
  };

  return (
    <AxiosContext.Provider value={value}>{children}</AxiosContext.Provider>
  );
};

export default AxiosInstanceProvider;
