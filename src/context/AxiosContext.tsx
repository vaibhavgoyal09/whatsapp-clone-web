import axios, { CanceledError } from "axios";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import User from "../models/User";
import FirebaseService from "../service/FirebaseService";
import { WhatsApi } from "../utils/Constants";
import ProgressStatus from "../utils/ProgressStatus";
import Utils from "../utils/Utils";
import { useAuth } from "./AuthContext";

interface AxiosContextInterface {
  currentUserModel: User | null;
  accessToken: string | null;
  progressStatus: ProgressStatus;
  updateCurrentUserModelState: () => void;
  postRequest: <T = any>(
    requestBody: any,
    params: object | null,
    requestPath: string,
    abortController: AbortController | undefined
  ) => Promise<T>;
  putRequest: <T = any>(
    requestBody: any,
    params: object | null,
    requestPath: string,
    abortController: AbortController | undefined
  ) => Promise<T>;
  uploadFile: (file: File) => Promise<string>;
  getRequest: <T = any>(
    requestPath: string,
    params: object | null,
    abortController: AbortController | undefined
  ) => Promise<T>;
  onUserLoggedOut: () => void;
  safeApiRequest: <T = any>(request: () => Promise<T>) => Promise<T>;
}

export const AxiosContext = createContext<AxiosContextInterface | null>(null);
export const useAxios = () => useContext(AxiosContext);
const AxiosInstanceProvider = ({ children }: { children: ReactNode }) => {
  const auth = useAuth()!;
  const [currentUserModel, setCurrentUserModel] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null); // Just a fake token
  const [progressStatus, setProgressStatus] = useState<ProgressStatus>({
    isLoading: false,
    progressPercent: 0,
  });
  const [authHeaderInterceptorId, setAuthHeaderInterceptorId] =
    useState<number>();

  let config = {
    baseURL: WhatsApi.BASE_URL,
    timeout: 1000 * 60 * 2, // 2 Minutes
    headers: {
      Accept: "*/*",
    },
  };

  const instanceRef = useRef(axios.create(config));

  useEffect(() => {
    if (auth.currentUser) {
      auth.getUserIdToken().then((token) => {
        if (token) {
          setAccessToken(token.substring(8, 5));
          const id = instanceRef.current.interceptors.request.use((config) => {
            config.headers = { Authorization: `Bearer ${token}` };
            return config;
          });
          setAuthHeaderInterceptorId(id);
        }
      });
    }
  }, [auth.currentUser]);

  useEffect(() => {
    async function retrieveCurrentUser() {
      if (accessToken) {
        getRequest(`${WhatsApi.GET_CURRENT_USER_INFO_URL}`, null).then(
          (data) => {
            let user = Utils.userFromJson(data);
            setCurrentUserModel(user);
          }
        );
      }
    }
    retrieveCurrentUser();

    return () => {};
  }, [accessToken, auth.isUserLoggedIn]);

  const firebaseService = new FirebaseService();

  async function safeApiRequest<T>(request: () => Promise<T>) {
    try {
      return await request();
    } catch (axiosError: any) {
      setProgressStatus({ isLoading: false, progressPercent: 0 });
      let message = "Check Your Internet Connection";
      console.log(axiosError);
      if (axiosError.response && axiosError.response.data) {
        message = axiosError.response.data["detail"];
      }
      throw Error(axiosError === CanceledError ? undefined : message );
    }
  }

  function updateCurrentUserModelState() {
    if (accessToken) {
      getRequest(`${WhatsApi.GET_CURRENT_USER_INFO_URL}`, null).then((data) => {
        let user = Utils.userFromJson(data);
        setCurrentUserModel(user);
      });
    }
  }

  function getUniqueString(): String {
    return crypto.randomUUID();
  }

  async function uploadFile(file: File) {
    return await safeApiRequest<string>(async () => {
      let fileName = getUniqueString() + `.${file.name.split(".").pop()}`;
      let fileRef = firebaseService.getStorageRef(fileName);
      await firebaseService.uploadFile(fileRef, file);
      return firebaseService.getMediaURL(fileRef);
    });
  }

  async function postRequest<T = any>(
    requestBody: any,
    params: object | null = null,
    requestPath: string,
    abortController: AbortController = new AbortController()
  ): Promise<T> {
    return await safeApiRequest<T>(async () => {
      setProgressStatus({ isLoading: true, progressPercent: 25 });

      let status: ProgressStatus = {
        isLoading: true,
        progressPercent: 0,
      };
      setProgressStatus(status);
      let response = await instanceRef.current.post(
        `${requestPath}`,
        requestBody,
        {
          params: params,
          signal: abortController.signal,
        }
      );
      if (response) {
        setProgressStatus({ isLoading: false, progressPercent: 0 });
        return response.data ? response.data : null;
      } else {
        setProgressStatus({ isLoading: false, progressPercent: 0 });
        return null;
      }
    });
  }

  async function getRequest<T = any>(
    requestPath: string,
    params: object | null,
    abortController: AbortController = new AbortController()
  ): Promise<T> {
    setProgressStatus({ isLoading: true, progressPercent: 25 });
    return await safeApiRequest<T>(async () => {
      let response = await instanceRef.current.get(requestPath, {
        params: params,
        signal: abortController.signal,
      });
      setProgressStatus({ isLoading: false, progressPercent: 0 });
      if (response.data) {
        setProgressStatus({ isLoading: false, progressPercent: 100 });
        return response.data;
      } else {
        setProgressStatus({ isLoading: false, progressPercent: 100 });
        return null;
      }
    });
  }

  async function putRequest<T = any>(
    requestBody: any,
    params: object | null,
    requestPath: string,
    abortController: AbortController = new AbortController()
  ): Promise<T> {
    return await safeApiRequest<T>(async () => {
      setProgressStatus({ isLoading: true, progressPercent: 25 });
      let response = await instanceRef.current.put(requestPath, requestBody, {
        params: params,
        signal: abortController.signal,
      });
      if (response !== undefined && response !== null) {
        setProgressStatus({ isLoading: false, progressPercent: 100 });
        return response.status ? response.request : null;
      } else {
        setProgressStatus({ isLoading: false, progressPercent: 100 });
        return null;
      }
    });
  }

  function onUserLoggedOut() {
    setAccessToken(null);
    setCurrentUserModel(null);
    instanceRef.current.interceptors.request.eject(authHeaderInterceptorId!);
  }

  const value: AxiosContextInterface = {
    currentUserModel,
    accessToken,
    progressStatus,
    postRequest,
    uploadFile,
    getRequest,
    safeApiRequest,
    updateCurrentUserModelState,
    onUserLoggedOut,
    putRequest,
  };

  return (
    <AxiosContext.Provider value={value}>{children}</AxiosContext.Provider>
  );
};

export default AxiosInstanceProvider;
