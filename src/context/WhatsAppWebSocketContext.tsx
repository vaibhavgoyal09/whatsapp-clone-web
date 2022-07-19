import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";
import React from 'react'
import { useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { WhatsApi } from "../utils/Constants";
import { useAxios } from "./AxiosContext";
import Message from "../models/Message";
import SendMessageRequest from "../models/SendMessageRequest";

interface WhatsAppWebSocketContextInterface {
  sendChatMessage: (message: SendMessageRequest) => void;
  lastChatMessage: Message | null;
}

export const WhatsAppWebSocketContext =
  createContext<WhatsAppWebSocketContextInterface | null>(null);
export const useWhatsappWebSocket = () => useContext(WhatsAppWebSocketContext);
function WhatsAppWebSocketContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const auth = useAxios();
  const currentUserModel = auth?.currentUserModel;
  const getSocketUrl = useCallback((): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!currentUserModel) {
          return;
        }
        resolve(`${WhatsApi.CHAT_WEBSOCKET_BASE_URL}/${currentUserModel.id}`);
      }, 5000);
    });
  }, [currentUserModel]);

  const { sendMessage, lastMessage, readyState } = useWebSocket(getSocketUrl);

  const [lastChatMessage, setLastChatMessage] = useState<Message | null>(null);

  useEffect(() => {
    let receivedMessage: string = lastMessage?.data;
    if (receivedMessage) {
      console.log(`Received Message ${receivedMessage}`);
      let jsonObject = JSON.parse(receivedMessage);
      // let message: Message = {
      //   id: lastJsonMessage["id"],
      //   senderId: lastJsonMessage.sender_id,
      //   type: lastJsonMessage.type,
      //   text: lastJsonMessage.message,
      //   mediaUrl: lastJsonMessage.media_url,
      //   chatId: lastJsonMessage.chat_id,
      //   timestamp: lastJsonMessage.created_at,
      // };
      // setLastChatMessage(message);
    }
  }, [lastMessage]);

  function sendChatMessage(message: SendMessageRequest) {
    if (readyState !== ReadyState.OPEN) {
      return;
    }
    sendMessage(
      JSON.stringify({
        type: 0,
        message: message,
      })
    );
  }

  const value: WhatsAppWebSocketContextInterface = {
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
