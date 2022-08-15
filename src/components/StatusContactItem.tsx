import React from "react";
import "../css/statusContactItemStyle.css";
import User from "../models/User";

interface Props {
  contact: User;
  onClick: () => void;
  isSelected?: boolean;
}

const StatusContactItem: React.FC<Props> = ({
  contact,
  onClick,
  isSelected = false,
}) => {
  if (!contact) {
    return null;
  }

  return (
    <div
      className={isSelected ? "scn scnWithBg" : "scn"}
      onClick={() => onClick()}
    >
      <img
        src={contact.profileImageUrl ? contact.profileImageUrl : "avatar.png"}
        alt="user profile"
        className="scavatar"
      />
      <div className="scinfoContainer">
        <div className="scunamec">
          <p className="scuname unselectable">{contact.name}</p>
          <p className="scuabout unselectable">{contact.about}</p>
        </div>
      </div>
    </div>
  );
};

export default StatusContactItem;
