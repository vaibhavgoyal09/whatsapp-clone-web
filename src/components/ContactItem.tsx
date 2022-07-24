import React from "react";
import "../css/contactItemStyle.css";
import User from "../models/User";

interface Props {
  contact: User;
  onClick: () => void;
  isSelected?: boolean
}

const ContactItem: React.FC<Props> = ({ contact, onClick, isSelected =false }) => {
  if (!contact) {
    return null;
  }

  return (
    <div className={isSelected ? "cn cnWithBg" : "cn"} onClick={() => onClick()}>
      <img
        src={contact.profileImageUrl ? contact.profileImageUrl : "avatar.png"}
        alt="user profile"
        className="avatar"
      />
      <div className="infoContainer">
        <div className="unamec">
          <p className="uname unselectable">{contact.name}</p>
          <p className="uabout unselectable">{contact.about}</p>
        </div>
      </div>
    </div>
  );
};

export default ContactItem;
