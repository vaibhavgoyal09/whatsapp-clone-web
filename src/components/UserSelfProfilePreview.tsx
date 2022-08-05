import React, { createRef, useCallback, useState } from "react";
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
  const [isUserNameFieldFocused, setIsUserNameFieldFocused] =
    useState<boolean>(false);
  const [isUserAboutFieldFocused, setIsUserAboutFieldFocused] =
    useState<boolean>(false);
  const [imageSrc, setImageSrc] = useState<string | undefined | null>(
    currentUserModel.profileImageUrl
  );
  const [name, setName] = useState<string>(currentUserModel.name);
  const [about, setAbout] = useState<string>(
    currentUserModel.about ? currentUserModel.about : ""
  );

  const handleUserNameFieldValueChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setName(event.target.value);
    },
    []
  );

  const handleUserAboutFieldValueChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setAbout(event.target.value);
    },
    []
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
              <div className="usSearchField">
                <input
                  type="text"
                  name="name"
                  autoComplete="off"
                  onClick={() => setIsUserNameFieldFocused(true)}
                  onChange={handleUserNameFieldValueChange}
                  value={name}
                />
              </div>

              <div className="icCtnr">
                <span className="lIc">
                  {isUserNameFieldFocused ? (
                    <i
                      className="fa-solid fa-check sM"
                      onClick={() => {
                        setIsUserNameFieldFocused(false);
                        updateUserName(name);
                      }}
                    />
                  ) : (
                    <i
                      className="fa-solid fa-pen sS"
                      onClick={() => {
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
            <div className="usSearchField">
              <input
                type="text"
                name="name"
                autoComplete="off" onClick={() => setIsUserAboutFieldFocused(true)}
                onChange={handleUserAboutFieldValueChange}
                value={about}
                placeholder={currentUserModel.about ? "" : "Enter about"}
              />
            </div>
            <div className="icCtnr">
              <span className="lIc">
                {isUserAboutFieldFocused ? (
                  <i
                    className="fa-solid fa-check sM"
                    onClick={() => {
                      setIsUserAboutFieldFocused(false);
                      updateUserAbout(about);
                    }}
                  />
                ) : (
                  <i
                    className="fa-solid fa-pen sS"
                    onClick={() => {
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
