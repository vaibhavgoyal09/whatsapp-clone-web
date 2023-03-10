import "../css/incomingCallPopupStyle.css";

interface Props {
  show: boolean;
  userName: string;
  userProfileImageUrl?: string | null;
  onCallRejectedClicked: () => void;
  onCallAcceptedClicked: () => void;
}

const IncomingCallPopup: React.FC<Props> = ({
  show,
  userName,
  userProfileImageUrl,
  onCallAcceptedClicked,
  onCallRejectedClicked,
}) => {
  if (!show) {
    return null;
  }

  return (
    <div className="icOverlay">
      <div className="icContent">
        <div className="icTab ">
          <img
            id="icUserProfileImg"
            alt="User Profile Picture"
            src={userProfileImageUrl ? userProfileImageUrl : "avatar.png"}
          />
          <div id="icUserName" className="unselectable">{userName}</div>
        </div>
        <div className="icTab">
          <div id="icTitle" className="unselectable">Incoming Call</div>
        </div>
        <div className="icTab" id="icTabActBtns">
          <div className="icActBtn unselectable" id="icAccept">
            Accept
          </div>
          <div className="icActBtn unselectable" id="icReject">Reject</div>
        </div>
      </div>
    </div>
  );
};

export default IncomingCallPopup;
