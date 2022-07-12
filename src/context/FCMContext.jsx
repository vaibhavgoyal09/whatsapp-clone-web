import React, { createContext, useContext, useEffect, useState } from "react";
import { messaging } from "../utils/FirebaseConfig";
import { getToken } from "firebase/messaging";

const FCMContext = createContext(null);
export const useFCM = useContext(FCMContext);

export default function FCMContextProvider({ children }) {
  const [messagingToken, setMessagingToken] = useState(null);

  useEffect(() => {
    getToken(messaging, { vapidKey: process.env.REACT_APP_WEB_TOKEN })
      .then((currentToken) => {
        if (currentToken) {
          setMessagingToken(currentToken);
        } else {
          console.log(
            "No registration token available. Request permission to generate one."
          );
        }
      })
      .catch((e) => console.log(e));
  });

  const value = {
    messagingToken,
  };
  return <FCMContext.Provider value={value}>children</FCMContext.Provider>;
}
