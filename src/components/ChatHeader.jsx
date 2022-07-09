import '../css/chatHeaderStyle.css';

const ChatHeader = ({profileImageUrl, onProfileClick}) => {
  return (
    <div className="hctnr">
      <img
        className="avt"
        src={profileImageUrl ? profileImageUrl : "avatar.png"}
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
