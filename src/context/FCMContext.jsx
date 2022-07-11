import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../utils/FirebaseConfig";

const FCMContext = createContext(null);
export const useFCM = useContext(FCMContext);

export default function FCMContextProvider({ children }) {
  const [messagingToken, setMessagingToken] = useState(null);

  const value = {
    messagingToken,
  };
  return <FCMContext.Provider value={value}>children</FCMContext.Provider>;
}
