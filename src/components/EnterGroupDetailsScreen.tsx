import React, { createRef, useState } from "react"
import "../css/enterGroupDetailsScreenStyle.css";
import { ReactComponent as CameraImage } from "../assets/camera.svg";


interface Props {
  onDone: (name: string, imageFile: File | null) => void;
  onClose: () => void;
}


const EnterGroupDetailsScreen: React.FC<Props> = ({ onDone, onClose }) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isGroupNameFieldFocused, setGroupNameFieldFocused] = useState<boolean>(false);
  const [groupName, setGroupName] = useState<string>("");
  const fileInputRef = createRef<HTMLInputElement>();

  const defaultAvatarImage = require('../assets/group_avatar.png');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let file: File | null = event.target.files ? event.target.files[0] : null;
    if (file) {
      setImageSrc(URL.createObjectURL(file));
      setImageFile(file);
    }
  };

  const handleGroupNameFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGroupName(event.target.value);
  };

  return (
    <div className="egContainer">
      <div className="egHeader">
        <span className="egbackBtn" onClick={() => onClose()}>
          <i className="fa-solid fa-arrow-left" />
        </span>
        <span className="egTitle">
          <h2>New Group</h2>
        </span>
      </div>
      <div className="egBottomCtnt">
        <form>
          <input
            type="file"
            onChange={handleFileChange}
            hidden
            ref={fileInputRef}
            accept="image/png, image/jpeg, image/jpg"
          />
        </form>
        <div className="egimageWrapper">
          <img
            className="egstdImg"
            src={imageSrc ? imageSrc : defaultAvatarImage}
            alt="profile"
          />
          <div
            className="egcameraOverlay"
            onClick={() => fileInputRef!.current!.click()}
          >
            <CameraImage className="egcamera" />
          </div>
        </div>
        <div className="egnameContainer">
          <div className="egnameCtnt">
            <div className="egnInputCtnr">
              <div
                className="egname"
                onClick={() => setGroupNameFieldFocused(true)}
              >
                <input type="text" placeholder="Enter group name" onChange={handleGroupNameFieldChange}/>
              </div>
            </div>
          </div>
          <div className={isGroupNameFieldFocused ? "egLine actv": "egLine inactv"} />
        </div>
      </div>
      <div className="egDoneBtnCtnr" onClick={() => {
        onDone(groupName, imageFile);
      }}>
        <span className="addic">
          <i className="fa-solid fa-check"></i>
        </span>
      </div>
    </div>
  );
}

export default EnterGroupDetailsScreen;
