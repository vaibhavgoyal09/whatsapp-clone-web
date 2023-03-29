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
import CallUserRequest from "../models/CallUserRequest";
import IncomingCall from "../models/IncomingCall";
import IncomingCallResponse, {
  IncomingCallResponseType,
} from "../models/IncomingCallResponse";
import IncomingCallResponseReceived from "../models/IncomingCallResponseReceived";
import CallingEventReceived from "../models/CallingEventReceived";
import CallingEvent from "../models/CallingEvents";

interface WhatsAppWebSocketContextInterface {
  sendChatMessage: (message: SendMessageRequest) => void;
  sendSelfTypingStatusChange: (isTyping: boolean, chatId: string) => void;
  sendOutgoingCall: (request: CallUserRequest) => void;
  sendIncomingCallResponse: (response: IncomingCallResponse) => void;
  sendCallingEvent: (event: CallingEvent) => void;
  lastChatMessage: Message | null;
  typingStatusChange: TypingStatusChange | null;
  callingEvent: CallingEventReceived | null;
  incomingCall: IncomingCall | null;
  incomingCallResponse: IncomingCallResponseReceived | null;
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
  const [typingStatusChange, setTypingStatusChange] =
    useState<TypingStatusChange | null>(null);
  const [incomingCall, setIncomingCall] = useState<IncomingCall | null>(null);
  const [incomingCallResponse, setIncomingCallResponse] =
    useState<IncomingCallResponseReceived | null>(null);
  const [callingEvent, setCallingEvent] = useState<CallingEventReceived | null>(
    null
  );

  useEffect(() => {
    var timeout = setTimeout(() => {
      if (incomingCall) {
        sendIncomingCallResponse({
          to_user_id: incomingCall.user_id,
          by_user_id: currentUserModel!.id,
          response: IncomingCallResponseType.rejected,
        });
        setIncomingCall(null);
      }
    }, 30000);

    return () => clearTimeout(timeout);
  }, [incomingCall]);

  useEffect(() => {
    var timeout = setTimeout(() => {
      setCallingEvent(null);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [callingEvent]);

  useEffect(() => {
    let receivedMessage: string = lastMessage?.data;

    if (receivedMessage) {
      let jsonObject = JSON.parse(receivedMessage);

      if (jsonObject.type === WsMessageType.chat_message) {
        let message: Message = Utils.messageFromJson(jsonObject.message);
        setLastChatMessage(message);
      } else if (jsonObject.type === WsMessageType.typing_status_change) {
        let statusChange: TypingStatusChange = {
          is_typing: jsonObject.message.is_typing,
          user_id: jsonObject.message.user_id,
          chat_id: jsonObject.message.chat_id,
        };
        setTypingStatusChange(statusChange);
      } else if (jsonObject.type === WsMessageType.incoming_call) {
        let incomingCall: IncomingCall = {
          call_type: jsonObject.message.call_type,
          user_id: jsonObject.message.user_id,
          user_name: jsonObject.message.user_name,
          user_profile_image_url: jsonObject.message.user_profile_image_url,
        };
        setIncomingCall(incomingCall);
      } else if (jsonObject.type === WsMessageType.incoming_call_response) {
        let response: IncomingCallResponseReceived = {
          byUserId: jsonObject.message.by_user_id,
          response: jsonObject.message.response,
        };

        setIncomingCallResponse(response);
      } else if (jsonObject.type === WsMessageType.calling_event) {
        let event: CallingEventReceived = {
          by_user_id: jsonObject.message.by_user_id,
          event: jsonObject.message.event,
        };
        setCallingEvent(event);
      }
    }
  }, [lastMessage]);

  function sendCallingEvent(event: CallingEvent) {
    if (readyState !== ReadyState.OPEN) {
      return;
    }
    sendMessage(
      JSON.stringify({
        type: WsMessageType.calling_event,
        message: event,
      })
    );
  }

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

  function sendOutgoingCall(request: CallUserRequest) {
    sendMessage(
      JSON.stringify({
        type: WsMessageType.incoming_call,
        message: request,
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

  function sendIncomingCallResponse(response: IncomingCallResponse) {
    if (readyState !== ReadyState.OPEN) {
      return;
    }
    setIncomingCall(null);
    sendMessage(
      JSON.stringify({
        type: WsMessageType.incoming_call_response,
        message: response,
      })
    );
  }

  const value: WhatsAppWebSocketContextInterface = {
    sendChatMessage,
    sendOutgoingCall,
    sendSelfTypingStatusChange,
    sendIncomingCallResponse,
    lastChatMessage,
    typingStatusChange,
    incomingCall,
    incomingCallResponse,
    callingEvent,
    sendCallingEvent,
  };

  return (
    <WhatsAppWebSocketContext.Provider value={value}>
      {children}
    </WhatsAppWebSocketContext.Provider>
  );
}

export default WhatsAppWebSocketContextProvider;
