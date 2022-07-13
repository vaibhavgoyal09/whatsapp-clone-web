import { useState } from "react";
import { useCallback } from "react";
import { createContext, useContext } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { WhatsApi } from "../utils/Constants";
import { useAxios } from "./AxiosContext";
import React from 'react'

export const WhatsAppWebSocketContext = createContext(null);
export const useWhatsappWebSocket = () => useContext(WhatsAppWebSocketContext);
function WhatsAppWebSocketContextProvider({ children }) {
  const { currentUserModel } = useAxios();
  const getSocketUrl = useCallback(() => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!currentUserModel) {
          return;
        }
        resolve(`${WhatsApi.CHAT_WEBSOCKET_BASE_URL}/${currentUserModel.id}`);
      }, 5000);
    });
  }, [currentUserModel]);

  const { sendJsonMessage, lastJsonMessage, readyState } =
    useWebSocket(getSocketUrl);

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  function sendChatMessage(message) {
    if(connectionStatus !== ReadyState.OPEN) {
      return;
    }
    sendJsonMessage({
      type: 0,
      message: message,
    });
  }

  const value = {
    sendChatMessage,
    lastJsonMessage
  };

  return (
    <WhatsAppWebSocketContext.Provider value={value}>
      {children}
    </WhatsAppWebSocketContext.Provider>
  );
}

export default WhatsAppWebSocketContextProvider;