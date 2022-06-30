import { RecaptchaVerifier, onAuthStateChanged, signInWithPhoneNumber, PhoneAuthProvider, signInWithCredential } from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";
import auth from "../utils/FirebaseConfig";

const AuthContext = createContext({
  currentUser: null,
  signInWithPhoneNumber: () => Promise,
});

export const useAuth = () => useContext(AuthContext);

export default function AuthContextProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
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

  const generateRecaptcha = (captchaContainerId) => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      captchaContainerId,
      {
        size: "invisible",
      },
      auth
    );
  };

  function verifyOtpAndSignInUser(otp) {
    let verificationId = window.confirmationResult.verificationId;
    let credential = PhoneAuthProvider.credential(verificationId, otp);
    
    return signInWithCredential(auth, credential)
  }

  const value = {
    currentUser,
    sendVerificationCode,
    verifyOtpAndSignInUser
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
