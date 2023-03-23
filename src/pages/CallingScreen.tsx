import Peer from "peerjs";
import "../css/callingScreenStyle.css";
import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAxios } from "../context/AxiosContext";
import { useWhatsappWebSocket } from "../context/WhatsAppWebSocketContext";
import CallUserRequest from "../models/CallUserRequest";
import IncomingCallResponse, {
  IncomingCallResponseType,
} from "../models/IncomingCallResponse";
import CallingEvent, { CallingEventType } from "../models/CallingEvents";

interface Props {
  remoteUserId: string;
  remoteUserName: string;
  remoteUserProfileImageUrl?: string | null;
  callType: string;
  actionType: string;
}

const CallingScreen = () => {
  const selfVideoRef = useRef<HTMLVideoElement>(null);
  const remoteUserVideoRef = useRef<HTMLVideoElement>(null);
  const location = useLocation();
  const axios = useAxios()!;
  const navigate = useNavigate();
  const peerJsInstance = useRef<Peer | null>(null);
  const websocket = useWhatsappWebSocket()!;
  const currentUser = axios.currentUserModel!;
  const localMediaStreamRef = useRef<MediaStream | null>(null);

  const props = location.state as Props;

  if (!props || !props.remoteUserId) {
    navigate("/");
  }

  useEffect(() => {
    if (websocket.incomingCallResponse) {
      let response = websocket.incomingCallResponse;
      if (response.response === IncomingCallResponseType.accepted) {
        peerJsInstance?.current?.connect(props.remoteUserId);
      } else if (response.response === IncomingCallResponseType.rejected) {
      }
    }
  }, [websocket.incomingCallResponse]);

  useEffect(() => {
    if (!peerJsInstance.current) {
      navigator.mediaDevices
        .getUserMedia({ audio: true, video: props.callType === "video" })
        .then((stream) => {
          var peer = new Peer(currentUser.id, { debug: 2 });

          peer.on("open", () => {
            if (props.actionType === "incoming") {
              let response: IncomingCallResponse = {
                to_user_id: props.remoteUserId,
                by_user_id: axios.currentUserModel!.id,
                response: IncomingCallResponseType.accepted,
              };
              websocket.sendIncomingCallResponse(response);
              peer.connect(props.remoteUserId);
            } else {
              let request: CallUserRequest = {
                to_user_id: props.remoteUserId,
                by_user_id: axios.currentUserModel!.id,
                call_type: props.callType,
              };
              websocket.sendOutgoingCall(request);
            }
          });
          localMediaStreamRef.current = stream;

          peer.on("connection", (con) => {
            con.on("open", () => {
              peer.call(props.remoteUserId, stream);
            });
            con.on("error", (e) => {
              console.log(e);
            });
          });

          peer.on("call", (call) => {
            call.answer(stream);

            call.on("stream", (remoteStream) => {
              console.log(remoteStream);
              remoteUserVideoRef!.current!.srcObject = remoteStream;
              remoteUserVideoRef.current?.play();
            });
          });
          selfVideoRef!.current!.srcObject = stream;
          selfVideoRef!.current!.play();
          peerJsInstance.current = peer;
        });
    }

    return () => {
      if (peerJsInstance?.current?.open) {
        peerJsInstance?.current?.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (websocket.callingEvent) {
      let event = websocket.callingEvent;
      if (event.event === CallingEventType.aborted) {
        peerJsInstance?.current?.destroy();
        localMediaStreamRef?.current
          ?.getTracks()
          .forEach((track) => track.stop());
        navigate("/");
      }
    }
  }, [websocket.callingEvent]);

  useEffect(() => {
    return () => {
      localMediaStreamRef?.current
        ?.getTracks()
        .forEach((track) => track.stop());
    };
  }, []);

  const handleCallAborted = () => {
    localMediaStreamRef?.current?.getTracks().forEach((track) => track.stop());
    peerJsInstance?.current?.destroy();
    let event: CallingEvent = {
      to_user_id: props.remoteUserId,
      event: CallingEventType.aborted,
    };
    websocket.sendCallingEvent(event);
    navigate("/");
  };

  return (
    <div className="csPage">
      <div className="csScreenWrapper">
        <div className="csRemoteVideoWrapper">
          {props.callType === "video" ? (
            <video id="csRemoteVideo" ref={remoteUserVideoRef} />
          ) : (
            <img
              id="csRemoteProfilePic"
              src={
                props.remoteUserProfileImageUrl
                  ? props.remoteUserProfileImageUrl
                  : "avatar.png"
              }
              alt="User Profile Image"
            />
          )}
          <div className="csVideoActionsContainer">
            <span className="csHangCall" onClick={() => handleCallAborted()}>
              <i className="fa-solid fa-phone-slash fa-flip-horizontal"></i>
            </span>
          </div>
        </div>
        {props.callType === "video" ? (
          <div className="csSelfVideoWrapper">
            <video id="csSelfVideo" ref={selfVideoRef} />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default CallingScreen;
