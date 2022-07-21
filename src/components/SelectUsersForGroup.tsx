import { useState } from "react";
import "../css/selectUsersForGroup.css"
import User from "../models/User";
import ContactItem from "./ContactItem";

interface Props {
  onUsersSelected: (userIds: number[]) => void;
  onClose: () => void;
  contacts: User[]
}

const SelectUserForGroup: React.FC<Props> = ({ onUsersSelected, onClose, contacts }) => {

  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

  const onSelectUser = (userId: number) => {
    const users = [...selectedUsers];
    if (selectedUsers.includes(userId)) {
      users.splice(users.at(userId)!);
    } else {
      users.push(userId);
    }
    setSelectedUsers(users);
  }

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
      <div className="suContactsCtnr" >
        {
          contacts.map((element: User, index: number) => (
            <ContactItem key={element.id} contact={element} onClick={() => onSelectUser(element.id)} />
          ))
        }
      </div>
    </div>
  );
};

export default SelectUserForGroup;
