import '../css/chatHeaderStyle.css';

const ChatHeader = ({remoteUserProfileImageUrl, onProfileClick}) => {
  return (
    <div className="hctnr">
      <img
        className="avt"
        src={remoteUserProfileImageUrl ? remoteUserProfileImageUrl : "avatar.png"}
        alt="your profile"
        onClick={() => onProfileClick()}
      />
      <div className="optionsContainer">
        <span><i></i></span>
      </div>
    </div>
  );
};

export default ChatHeader;
