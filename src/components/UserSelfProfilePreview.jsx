import { useRef, useState } from "react";
import "../css/userSelfProfilePreviewStyle.css";
import { ReactComponent as CameraImage } from "../assets/camera.svg";

const UserSelfProfilePreview = ({ currentUserModel, onClose }) => {
  const fileInputRef = useRef();
  const [isUserNameFieldFocused, setIsUserNameFieldFocused] = useState(false);
  const [isUserNameFieldEditable, setIsUserNameFieldEditable] = useState(false);
  const [isUserAboutFieldFocused, setIsUserAboutFieldFocused] = useState(false);
  const [isUserAboutFieldEditable, setIsUserAboutEditable] = useState(false);

  if (!currentUserModel) {
    return null;
  }

  return (
    <div className="usContainer">
      <div className="usheader">
        <span className="usbackBtn" onClick={() => onClose()}>
          <i className="fa-solid fa-arrow-left" />
        </span>
        <span className="usTitle">
          <h2>Profile</h2>
        </span>
      </div>
      <div className="bottomCtnt">
        <div className="usimageWrapper">
          <img
            className="usstdImg"
            src={
              currentUserModel.profileImageUrl
                ? currentUserModel.profileImageUrl
                : "avatar.png"
            }
            alt="profile"
          />
          <div
            className="uscameraOverlay"
            onClick={() => fileInputRef.current.click()}
          >
            <CameraImage className="uscamera" />
          </div>
        </div>
        <div className="nameContainer">
          <div className="nameCtnt">
            <span className="nt tgreen">Your Name</span>
            <div className="nInputCtnr">
              <div
                className="usname"
                contentEditable={isUserNameFieldEditable}
                onClick={() => setIsUserNameFieldFocused(true)}
              >
                {currentUserModel.name}
              </div>
              <div className="icCtnr">
                <span
                  className="lIc"
                  onClick={() => {
                    setIsUserNameFieldEditable(true);
                    setIsUserNameFieldFocused(true);
                  }}
                >
                  {isUserNameFieldEditable ? (
                  <i class="fa-solid fa-check sM"/>
                ) : (
                  <i
                    className="fa-solid fa-pen sS"
                    onClick={() => {
                      setIsUserNameFieldFocused(true);
                      setIsUserNameFieldFocused(true);
                    }}
                  />
                )}
                </span>
              </div>
            </div>
          </div>
          {isUserNameFieldFocused ? <div className="gLine" /> : null}
          <p className="nSub">
            This is not your username or pin. This name will be visible <br />{" "}
            to your Whatsapp contacts only.{" "}
          </p>
        </div>
      </div>
      <div className="aboutContainer">
        <div className="aboutCtnt">
          <span className="nt tgreen">About</span>
          <div className="aInputCtnr">
            <div
              className="usabout"
              contentEditable={isUserAboutFieldEditable}
              onClick={() => isUserAboutFieldFocused(true)}
            >
              {currentUserModel.about}
            </div>
            <div className="icCtnr">
              <span className="lIc">
                {isUserAboutFieldEditable ? (
                  <i class="fa-solid fa-check sM"/>
                ) : (
                  <i
                    className="fa-solid fa-pen sS"
                    onClick={() => {
                      setIsUserAboutEditable(true);
                      setIsUserAboutFieldFocused(true);
                    }}
                  />
                )}
              </span>
            </div>
          </div>
        </div>
        {isUserAboutFieldFocused ? <div className="gLine" /> : null}
      </div>
    </div>
  );
};

export default UserSelfProfilePreview;
