import Peer from "peerjs";
import "../css/callingScreenStyle.css";
import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAxios } from "../context/AxiosContext";
import User from "../models/User";

interface Props {
  remoteUser: User;
  callType: string;
}

const CallingScreen = () => {
  const selfVideoRef = useRef<HTMLVideoElement>(null);
  const remoteUserVideoRef = useRef<HTMLVideoElement>(null);
  const location = useLocation();
  const axios = useAxios()!;
  const navigate = useNavigate();
  const [peerJsInstance, setPeerJsInstance] = useState<Peer>();
  const currentUser = axios.currentUserModel!;

  const props = location.state as Props;

  if (!props || !props.remoteUser) {
    navigate("/");
  }

  useEffect(() => {
    const peer = new Peer(currentUser.id);
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
