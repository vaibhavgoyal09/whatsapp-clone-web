import React, { createRef, useRef, useState } from "react";
import "../css/userSelfProfilePreviewStyle.css";
import { ReactComponent as CameraImage } from "../assets/camera.svg";
import User from "../models/User";

interface Props {
  currentUserModel: User;
  onClose: () => void;
  updateUserName: (name: string) => void;
  updateUserAbout: (about: string) => void;
  updateUserProfileImage: (
    profileImageFile: File | null,
    removeProfileImage: boolean
  ) => void;
}

const UserSelfProfilePreview: React.FC<Props> = ({
  currentUserModel,
  onClose,
  updateUserName,
  updateUserAbout,
  updateUserProfileImage,
}) => {
  const fileInputRef = createRef<HTMLInputElement>();
  const nameFieldRef = createRef<HTMLInputElement>();
  const aboutFieldRef = createRef<HTMLInputElement>();
  const [isUserNameFieldFocused, setIsUserNameFieldFocused] =
    useState<boolean>(false);
  const [isUserNameFieldEditable, setIsUserNameFieldEditable] =
    useState<boolean>(false);
  const [isUserAboutFieldFocused, setIsUserAboutFieldFocused] =
    useState<boolean>(false);
  const [isUserAboutFieldEditable, setIsUserAboutEditable] =
    useState<boolean>(false);
  const [imageSrc, setImageSrc] = useState<string | undefined | null>(
    currentUserModel.profileImageUrl
  );

  if (!currentUserModel) {
    return null;
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let file: File | null = event.target.files ? event.target.files[0] : null;
    if (file) {
      setImageSrc(URL.createObjectURL(file));
      updateUserProfileImage(file, false);
    } else {
      updateUserProfileImage(null, true);
    }
  };

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
        <form>
          <input
            type="file"
            onChange={handleFileChange}
            hidden
            ref={fileInputRef}
            accept="image/png, image/jpeg, image/jpg"
          />
        </form>
        <div className="usimageWrapper">
          <img
            className="usstdImg"
            src={imageSrc ? imageSrc : "avatar.png"}
            alt="profile"
          />
          <div
            className="uscameraOverlay"
            onClick={() => fileInputRef!.current!.click()}
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
                ref={nameFieldRef}
                contentEditable={isUserNameFieldEditable}
                onClick={() => setIsUserNameFieldFocused(true)}
              >
                {currentUserModel.name}
              </div>
              <div className="icCtnr">
                <span className="lIc">
                  {isUserNameFieldEditable ? (
                    <i
                      className="fa-solid fa-check sM"
                      onClick={() => {
                        setIsUserNameFieldEditable(false);
                        setIsUserNameFieldFocused(false);
                        updateUserName(nameFieldRef!.current!.innerText);
                      }}
                    />
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
              ref={aboutFieldRef}
              contentEditable={isUserAboutFieldEditable}
              onClick={() => setIsUserAboutFieldFocused(true)}
            >
              {currentUserModel.about}
            </div>
            <div className="icCtnr">
              <span className="lIc">
                {isUserAboutFieldEditable ? (
                  <i
                    className="fa-solid fa-check sM"
                    onClick={() => {
                      setIsUserAboutEditable(false);
                      setIsUserAboutFieldFocused(false);
                      updateUserAbout(aboutFieldRef!.current!.innerText);
                    }}
                  />
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
