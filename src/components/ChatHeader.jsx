import '../css/chatHeaderStyle.css';

const ChatHeader = ({profileImageUrl, onProfileClick, userName}) => {
  return (
    <div className="chtnr">
      <img
        className="avt"
        src={profileImageUrl ? profileImageUrl : "avatar.png"}
        alt="your profile"
        onClick={() => onProfileClick()}
      />
      <div className="chname">{userName}</div>
      <div className="choptionsContainer">
        <span className='chic'><i className="fa-solid fa-ellipsis-vertical"/></span>
        <span className='chic'><i className="fa-solid fa-magnifying-glass"/></span>
        <span className="chic"><i className="fa-solid fa-phone"/></span>
        <span className="chic"><i className="fa-solid fa-video"/></span>
      </div>
    </div>
  );
};

export default ChatHeader;
