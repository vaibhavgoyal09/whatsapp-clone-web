import "../css/chatHeaderStyle.css";

interface Props {
  profileImageUrl?: string | null;
  onProfileClick: () => void;
  userName: string;
}

const ChatHeader: React.FC<Props> = ({
  profileImageUrl,
  onProfileClick,
  userName,
}) => {
  return (
    <div className="chtnr">
      <img
        className="avt"
        onClick={() => onProfileClick()}
        src={profileImageUrl ? profileImageUrl : "avatar.png"}
        alt="your profile"
      />
      <div className="chname" onClick={() => onProfileClick()}>
        {userName}
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
