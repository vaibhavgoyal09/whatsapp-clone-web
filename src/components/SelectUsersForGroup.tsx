import { useState } from "react";
import "../css/selectUsersForGroup.css";
import User from "../models/User";
import ContactItem from "./ContactItem";

interface Props {
  onUsersSelected: (userIds: number[]) => void;
  onClose: () => void;
  contacts: User[];
}

const SelectUserForGroup: React.FC<Props> = ({
  onUsersSelected,
  onClose,
  contacts,
}) => {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const onSelectUser = (userId: string) => {
    const users = [...selectedUsers];
    if (selectedUsers.includes(userId)) {
      users.splice(users.indexOf(userId), 1);
    } else {
      users.push(userId);
    }
    setSelectedUsers(users);
  };

  return (
    <div className="suCtnr">
      <div className="suHeader">
        <span className="subackBtn" onClick={() => onClose()}>
          <i className="fa-solid fa-arrow-left" />
        </span>
        <span className="suTitle unselectable">
          <h2>Add Group Participants</h2>
        </span>
      </div>
      <div className="suBtmCtnt">
        <div className="suSearchField">
          <input type="text" name="name" placeholder="Type User Name" />
        </div>
      </div>
      <div className="suContactsCtnr">
        {contacts.map((element: User) => (
          <ContactItem
            key={element.id}
            contact={element}
            onClick={() => onSelectUser(element.id)}
            isSelected={selectedUsers.includes(element.id)}
          />
        ))}
      </div>
      <div className="suDoneBtnCtnr">
        <span className="addic">
          <i className="fa-solid fa-check"></i>
        </span>
      </div>
    </div>
  );
};

export default SelectUserForGroup;
