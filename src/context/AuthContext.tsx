import {
  ConfirmationResult,
  getIdToken,
  onAuthStateChanged,
  PhoneAuthProvider,
  signInWithCredential,
  signInWithPhoneNumber,
  signOut,
  User as FirebaseUser,
  UserCredential,
} from "firebase/auth";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { auth } from "../utils/FirebaseConfig";

interface AuthContextInterface {
  currentUser: FirebaseUser | null;
  isUserLoggedIn: boolean;
  verifyOtpAndSignInUser: (otp: string) => Promise<UserCredential>;
  sendVerificationCode: (phoneNumber: string) => Promise<ConfirmationResult>;
  getUserIdToken: () => Promise<string | null>;
  logOut: () => Promise<void>;
  setUserLoggedIn: () => void;
}

const AuthContext = createContext<AuthContextInterface | null>(null);

export const useAuth = () => useContext(AuthContext);

interface AuthPreferences {
  isUserLoggedIn: boolean
}

export default function AuthContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Auth State Changed", user);
      setCurrentUser(user ? user : null);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (localStorage.getItem("authPreferences")) {
      const prefs = JSON.parse(localStorage.getItem("authPreferences")!)
      setIsUserLoggedIn(prefs.isUserLoggedIn ? prefs.isUserLoggedIn: false); 
    }
  }, []);

  async function sendVerificationCode(phoneNumber: string) {
    let appVerifier = (window as any).recaptchaVerifier;
    return await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
  }

  function setUserLoggedIn() {
    const prefs: AuthPreferences = { isUserLoggedIn: true }
    localStorage.setItem("authPreferences", JSON.stringify(prefs));
    setIsUserLoggedIn(true);
  }

  function verifyOtpAndSignInUser(otp: string) {
    let verificationId = (window as any).confirmationResult.verificationId;
    let credential = PhoneAuthProvider.credential(verificationId, otp);

    return signInWithCredential(auth, credential);
  }

  async function getUserIdToken() {
    return new Promise<string | null>(async (resolve, reject) => {
      if (!currentUser) {
        return resolve(null);
      }
      try {
        resolve(await getIdToken(currentUser));
      } catch (e: any) {
        reject(Error(e.message));
      }
    });
  }

  function logOut() {
    return signOut(auth);
  }

  const value: AuthContextInterface = {
    currentUser,
    isUserLoggedIn,
    sendVerificationCode,
    verifyOtpAndSignInUser,
    getUserIdToken,
    logOut,
    setUserLoggedIn,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
