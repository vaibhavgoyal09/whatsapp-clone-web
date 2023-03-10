import Peer from "peerjs";
import "../css/callingScreenStyle.css";
import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAxios } from "../context/AxiosContext";
import { useWhatsappWebSocket } from "../context/WhatsAppWebSocketContext";
import CallUserRequest from "../models/CallUserRequest";

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
  const [peerJsInstance, setPeerJsInstance] = useState<Peer>();
  const [localMediaStream, setLocalMediaStream] = useState<MediaStream | null>(
    null
  );
  const websocket = useWhatsappWebSocket()!;
  const currentUser = axios.currentUserModel!;

  const props = location.state as Props;

  if (!props || !props.remoteUserId) {
    navigate("/");
  }

  useEffect(() => {});

  useEffect(() => {
    if (localMediaStream && props.callType === "video") {
      selfVideoRef!.current!.srcObject = localMediaStream;
      selfVideoRef.current?.play();
    }
  }, [localMediaStream]);

  useEffect(() => {
    if (props.actionType === "outgoing") {
      let request: CallUserRequest = {
        to_user_id: props.remoteUserId,
        by_user_id: axios.currentUserModel!.id,
        call_type: props.callType,
      };
      websocket.sendOutgoingCall(request);
    }
  }, []);

  useEffect(() => {
    const peer = new Peer(currentUser.id);

    peer.on("call", (call) => {
      call.answer(localMediaStream!);
      call.on("stream", (remoteStream) => {
        remoteUserVideoRef!.current!.srcObject = remoteStream;
        remoteUserVideoRef.current?.play();
      });
    });
    setPeerJsInstance(peer);
  }, []);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: props.callType === "video", audio: true })
      .then((stream: MediaStream) => {
        setLocalMediaStream(stream);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

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
            <span className="csHangCall">
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
