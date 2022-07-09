import {
  RecaptchaVerifier,
  onAuthStateChanged,
  signInWithPhoneNumber,
  PhoneAuthProvider,
  signInWithCredential,
  getIdToken,
} from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";
import auth from "../utils/FirebaseConfig";

const AuthContext = createContext({
  currentUser: null,
  verifyOtpAndSignInUser: () => Promise,
  sendVerificationCode: () => Promise,
  getUserIdToken: () => Promise,
});

export const useAuth = () => useContext(AuthContext);

export default function AuthContextProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(auth.currentUser);
  console.log("Auth Context", auth.currentUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Auth State Changed", user);
      setCurrentUser(user ? user : null);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  function sendVerificationCode(phoneNumber, captchaContainerId) {
    generateRecaptcha(captchaContainerId);

    let appVerifier = window.recaptchaVerifier;
    return signInWithPhoneNumber(auth, phoneNumber, appVerifier);
  }

  function generateRecaptcha(captchaContainerId) {
    window.recaptchaVerifier = new RecaptchaVerifier(
      captchaContainerId,
      {
        size: "invisible",
      },
      auth
    );
  }

  function verifyOtpAndSignInUser(otp) {
    let verificationId = window.confirmationResult.verificationId;
    let credential = PhoneAuthProvider.credential(verificationId, otp);

    return signInWithCredential(auth, credential);
  }

  async function getUserIdToken() {
    if (!currentUser) {
      return null;
    }
    try {
      return await getIdToken(currentUser);
    } catch (e) {
      return Error(e);
    }
  }

  const value = {
    currentUser,
    sendVerificationCode,
    verifyOtpAndSignInUser,
    getUserIdToken,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
