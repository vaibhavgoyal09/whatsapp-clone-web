import React from "react";
import "../css/sidebarHeader.css";

const SidebarHeader = ({ profileImageUrl, onProfileClick }) => {
  return (
    <div className="hctnr">
      <img
        className="avt"
        src={profileImageUrl ? profileImageUrl : "avatar.png"}
        alt="your profile"
        onClick={() => onProfileClick()}
      />
      <div className="optionsContainer">
        <span className="smicon">
          <i className="fa-solid fa-spinner"></i>
        </span>
        <span className="smicon">
          <i className="fa-solid fa-inbox"></i>
        </span>
        <span className="smicon">
          <i className="fa-solid fa-ellipsis-vertical"></i>
        </span>
      </div>
    </div>
  );
};

export default SidebarHeader;
