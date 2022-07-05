import React from "react";
import "../css/sidebarHeader.css";

const SidebarHeader = (props) => {
  return (
    <div className="opcnt">
      <img
        className="avt"
        src={props.profileImageUrl ? props.profileImageUrl : "avatar.png"}
        alt="your profile"
      />
    </div>
  );
};

export default SidebarHeader;
