import "../css/chatHeaderStyle.css";
import { ChatType } from "../models/Chat";
import moment from "moment";
import { useEffect, useState } from "react";

interface Props {
  profileImageUrl?: string | null;
  onProfileClick: () => void;
  name: string;
  type: number;
  isUserOnline: boolean | null;
  lastOnlineAt: number | null;
}

const ChatHeader: React.FC<Props> = ({
  profileImageUrl,
  onProfileClick,
  name,
  type,
  isUserOnline,
  lastOnlineAt,
}) => {

  const [showLastSeen, setShowLastSeen] = useState<boolean>(true);

  useEffect(() => {
    setShowLastSeen(true);
    setTimeout(() => {
      setShowLastSeen(false);
    }, 2000);
  }, [isUserOnline]);

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
      <img
        className="avt"
        onClick={() => onProfileClick()}
        src={profileImageUrl ? profileImageUrl : "avatar.png"}
        alt="your profile"
      />
      <div className="chname" onClick={() => onProfileClick()}>
        <p className="cname">{name}</p>
        {lastSeenElement}
      </div>
      <div className="choptionsContainer">
        <span className="chic">
          <i className="fa-solid fa-ellipsis-vertical" />
        </span>
        <span className="chic">
          <i className="fa-solid fa-magnifying-glass" />
        </span>
        <span className="chic">
          <i className="fa-solid fa-phone" />
        </span>
        <span className="chic">
          <i className="fa-solid fa-video" />
        </span>
      </div>
    </div>
  );
};

export default ChatHeader;
