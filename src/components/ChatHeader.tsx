import "../css/chatHeaderStyle.css";
import { ChatType } from "../models/Chat";
import Utils from "../utils/Utils";

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
  lastOnlineAt
}) => {

  let lastSeenText: string | null = null; 

  if (type === ChatType.oneToOne) {
    lastSeenText = isUserOnline ? "Online": Utils.timeSince(new Date(lastOnlineAt!));
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
        { type === ChatType.oneToOne ? <p className="cLastSeen">{lastSeenText}</p> : null }
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
