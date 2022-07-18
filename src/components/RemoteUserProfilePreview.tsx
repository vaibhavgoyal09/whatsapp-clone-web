import React from "react";
import "../css/remoteUserProfilePreviewStyle.css";
import { parsePhoneNumber } from "libphonenumber-js";
import User from '../models/User';


interface Props {
  onClose: () => void;
  user: User
}


const RemoteUserProfilePreview: React.FC<Props> = ({ onClose, user }) => {
  if (!user) {
    return null;
  }
  let phoneNumber = parsePhoneNumber(user.phoneNumber);
  return (
    <div className="rmCtnr">
      <div className="rmHeaderCtnr">
        <span className="rmCloseBtn" onClick={() => onClose()}>
          <i className="fa-solid fa-xmark" />
        </span>
        <span className="rmTitle unselectable">
          <p>Contact Info</p>
        </span>
      </div>
      <div className="rmBottomCtnr">
        <div className="imgCtnr">
          <img
            className="rmUserProfilePic"
            src={user.profileImageUrl ? user.profileImageUrl : "avatar.png"}
            alt="profile"
          />
        </div>
        <div className="rmUserDetailsCtnr">
          <p className="rmUserName">{user.name}</p>
          <p className="rmUserPhone">{phoneNumber.formatInternational()}</p>
        </div>
        <div className="rmAboutCtnr">
          <span className="rmaT unselectable">
            <p>About</p>
          </span>
          <div className="rmabout">
            <p>{user.about}</p>
          </div>
        </div>
        <div className="rmOptionsContainer unselectable">
          <div className="rmOpCtnr">
            <div className="rmOpCtnt">
              <span className="rmWarnIcon">
                <i className="fa-solid fa-ban" />
              </span>
              <span className="rmOpAction">Block {user.name}</span>
            </div>
          </div>
          <div className="rmOpCtnr">
            <div className="rmOpCtnt">
              <span className="rmWarnIcon">
              <i className="fa-solid fa-thumbs-down"/>
              </span>
              <span className="rmOpAction">Report {user.name}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemoteUserProfilePreview;
