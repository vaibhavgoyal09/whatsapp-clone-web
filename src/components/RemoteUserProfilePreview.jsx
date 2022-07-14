import React from "react";
import "../css/remoteUserProfilePreviewStyle.css";
import { parsePhoneNumber } from "libphonenumber-js";

const RemoteUserProfilePreview = ({ onClose, user }) => {
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
        <div className="rmOptionsContainer">
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
