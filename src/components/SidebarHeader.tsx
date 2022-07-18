import React from "react";
import { useState } from "react";
import "../css/sidebarHeader.css";
import { ReactComponent as ChatImage } from "../assets/chat.svg";
import { ReactComponent as StatusImage } from "../assets/status.svg";
import { ReactComponent as OptionsImage } from "../assets/more.svg";

interface Props {
  profileImageUrl: string | null | undefined;
  onProfileClick: () => void;
  onShowStatusScreen: () => void;
  onCreateNewGroupClicked: () => void;
  onLogOutClicked: () => void;
}

const SidebarHeader: React.FC<Props> = ({
  profileImageUrl,
  onProfileClick,
  onShowStatusScreen,
  onCreateNewGroupClicked,
  onLogOutClicked,
}) => {
  const [showOptionsDropdown, setShowOptionsDropdown] = useState(false);

  return (
    <div className="hctnr">
      <img
        className="avt"
        src={profileImageUrl ? profileImageUrl : "avatar.png"}
        alt="your profile"
        onClick={() => onProfileClick()}
      />
      <div className="optionsContainer">
        <StatusImage className="smicon" onClick={() => onShowStatusScreen()} />
        <ChatImage className="smicon" />
        <div className="shdropdown">
          <div
            className={
              showOptionsDropdown
                ? "shOptionBtnCtnr btnSelected"
                : "shOptionBtnCtnr"
            }
          >
            <OptionsImage
              id="moreButton"
              className="smicon"
              onClick={() => setShowOptionsDropdown(!showOptionsDropdown)}
            />
          </div>
          <div
            className={showOptionsDropdown ? "dropCtnt shShowDrop" : "dropCtnt"}
          >
            <div
              className="shDropOption"
              onClick={() => onCreateNewGroupClicked()}
            >
              <p className="unselectable">New Group</p>
            </div>
            <div className="shDropOption">
              <p className="unselectable">Starred Messages</p>
            </div>
            <div className="shDropOption">
              <p className="unselectable">Settings</p>
            </div>
            <div className="shDropOption" onClick={() => onLogOutClicked()}>
              <p className="unselectable">Log Out</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarHeader;
