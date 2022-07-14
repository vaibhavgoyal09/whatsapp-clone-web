import React, { createContext, useCallback, useContext, useState } from "react";
import { useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { WhatsApi } from "../utils/Constants";
import { useAxios } from "./AxiosContext";
import Message from "../models/Message";

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

  const [lastChatMessage, setLastChatMessage] = useState(null);

  useEffect(() => {
    if (lastJsonMessage) {
      console.log(`Received Message ${lastJsonMessage}`);
      let message = new Message(
        lastJsonMessage.id,
        lastJsonMessage.sender_id,
        lastJsonMessage.type,
        lastJsonMessage.message,
        lastJsonMessage.media_url,
        lastJsonMessage.chat_id,
        lastJsonMessage.created_at
      );
      setLastChatMessage(message);
    }
  }, [lastJsonMessage]);

  function sendChatMessage(message) {
    if (readyState !== ReadyState.OPEN) {
      return;
    }
    sendJsonMessage({
      type: 0,
      message: message,
    });
  }

  const value = {
    sendChatMessage,
    lastChatMessage,
  };

  return (
    <WhatsAppWebSocketContext.Provider value={value}>
      {children}
    </WhatsAppWebSocketContext.Provider>
  );
}

export default WhatsAppWebSocketContextProvider;
