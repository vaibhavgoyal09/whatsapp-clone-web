import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";
import { useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { WhatsApi } from "../utils/Constants";
import { useAxios } from "./AxiosContext";
import Message from "../models/Message";
import SendMessageRequest from "../models/SendMessageRequest";
import TypingStatusChange from "../models/TypingStatusChange";
import { WsMessageType } from "../models/WsClientMessage";
import Utils from "../utils/Utils";

interface WhatsAppWebSocketContextInterface {
  sendChatMessage: (message: SendMessageRequest) => void;
  sendSelfTypingStatusChange: (isTyping: boolean, chatId: string) => void;
  lastChatMessage: Message | null;
  typingStatusChange: TypingStatusChange | null;
}

export const WhatsAppWebSocketContext =
  createContext<WhatsAppWebSocketContextInterface | null>(null);
export const useWhatsappWebSocket = () => useContext(WhatsAppWebSocketContext);
function WhatsAppWebSocketContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const axios = useAxios();
  const currentUserModel = axios?.currentUserModel;
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
  const [typingStatusChange, setTypingStatusChange] = useState<TypingStatusChange | null>(null);

  useEffect(() => {
    let receivedMessage: string = lastMessage?.data;
    console.log(receivedMessage);
    if (receivedMessage) {
      let jsonObject = JSON.parse(receivedMessage);
      if (jsonObject.type === WsMessageType.chat_message) {
        let message: Message = Utils.messageFromJson(jsonObject.message);
        setLastChatMessage(message);
      } else if (jsonObject.type === WsMessageType.typing_status_change) {
        let statusChange: TypingStatusChange = {
          is_typing: jsonObject.message.is_typing,
          user_id: jsonObject.message.user_id,
          chat_id: jsonObject.message.chat_id
        };
        setTypingStatusChange(statusChange);
      }
    }
  }, [lastMessage]);

  function sendChatMessage(message: SendMessageRequest) {
    if (readyState !== ReadyState.OPEN) {
      return;
    }
    sendMessage(
      JSON.stringify({
        type: WsMessageType.chat_message,
        message: message,
      })
    );
  }

  function sendSelfTypingStatusChange(isTyping: boolean, chatId: string) {
    if (readyState !== ReadyState.OPEN) {
      return;
    }
    sendMessage(
      JSON.stringify({
        type: WsMessageType.typing_status_change,
        message: { is_typing: isTyping, chat_id: chatId },
      })
    );
  }

  const value: WhatsAppWebSocketContextInterface = {
    sendChatMessage,
    sendSelfTypingStatusChange,
    lastChatMessage,
    typingStatusChange
  };

  return (
    <WhatsAppWebSocketContext.Provider value={value}>
      {children}
    </WhatsAppWebSocketContext.Provider>
  );
}

export default WhatsAppWebSocketContextProvider;
