import "../css/chatHeaderStyle.css";
import { ChatType } from "../models/Chat";
import moment from "moment";
import { useEffect, useState } from "react";
import { ReactComponent as BackArrow } from "../assets/back_button.svg";

interface Props {
  profileImageUrl?: string | null;
  onProfileClick: () => void;
  name: string;
  type: number;
  isUserOnline: boolean | null;
  lastOnlineAt: number | null;
  isTyping: boolean;
  onBack: () => void;
  onVideoCallClicked: () => void;
  onAudioCallClicked: () => void;
}

const ChatHeader: React.FC<Props> = ({
  profileImageUrl,
  onProfileClick,
  name,
  type,
  isUserOnline,
  lastOnlineAt,
  isTyping,
  onBack,
  onAudioCallClicked,
  onVideoCallClicked
}) => {
  const [showLastSeen, setShowLastSeen] = useState<boolean>(true);

  useEffect(() => {
    setShowLastSeen(true);
    setTimeout(() => {
      if (!isUserOnline) {
        setShowLastSeen(false);
      }
    }, 5000);
  }, [name]);

  let lastSeenText: string | null = null;

  if (type === ChatType.oneToOne) {
    lastSeenText = isUserOnline
      ? "Online"
      : `Last Seen ${moment(new Date(lastOnlineAt!)).fromNow()}`;
  }

  let lastSeenElement: JSX.Element | null = null;

  if (type === ChatType.oneToOne && showLastSeen) {
    lastSeenElement = <p className="cLastSeen">{lastSeenText}</p>;
  }

  return (
    <div className="chtnr">
      <span className="chBackIcon" onClick={() => onBack()}><BackArrow className="chBackArrow"/></span>
      <img
        className="avt"
        onClick={() => onProfileClick()}
        src={profileImageUrl ? profileImageUrl : "avatar.png"}
        alt="your profile"
      />
      <div className="chname" onClick={() => onProfileClick()}>
        <p className="cname">{name}</p>
        {isTyping ? <p className="cTyping">typing...</p> : lastSeenElement}
      </div>
      <div className="choptionsContainer">
        <span className="chic">
          <i className="fa-solid fa-ellipsis-vertical" />
        </span>
        <span className="chic">
          <i className="fa-solid fa-magnifying-glass" />
        </span>
        <span className="chic" onClick={() => onAudioCallClicked()}>
          <i className="fa-solid fa-phone" />
        </span>
        <span className="chic" onClick={() => onVideoCallClicked()}>
          <i className="fa-solid fa-video" />
        </span>
      </div>
    </div>
  );
};

export default ChatHeader;
