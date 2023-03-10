import Peer from "peerjs";
import "../css/callingScreenStyle.css";
import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAxios } from "../context/AxiosContext";
import User from "../models/User";
import { useWhatsappWebSocket } from "../context/WhatsAppWebSocketContext";
import CallUserRequest from "../models/CallUserRequest";

interface Props {
  remoteUserId: string;
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
  const websocket = useWhatsappWebSocket()!;
  const currentUser = axios.currentUserModel!;

  const props = location.state as Props;

  if (!props || !props.remoteUserId) {
    navigate("/");
  }

  useEffect(() => {
    if (props.actionType === "outgoing") {
      let request : CallUserRequest =  {
        to_user_id: props.remoteUserId,
        by_user_id: axios.currentUserModel!.id,
        call_type: props.callType
      }
      websocket.sendOutgoingCall(request);
    }
  }, []);

  useEffect(() => {
    const peer = new Peer(currentUser.id);
    setPeerJsInstance(peer)
  }, []);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: props.callType === "video", audio: true })
      .then((stream: MediaStream) => {
        selfVideoRef!.current!.srcObject = stream;
        selfVideoRef!.current!.play();
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  return (
    <div className="csPage">
      <div className="csVideoScreenWrapper">
        <div className="csSelfVideoWrapper">
          <video id="csSelfVideo" ref={selfVideoRef} />
        </div>
      </div>
    </div>
  );
};

export default CallingScreen;
