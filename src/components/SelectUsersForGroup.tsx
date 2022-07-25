import { useEffect, useState } from "react";
import "../css/selectUsersForGroup.css";
import User from "../models/User";
import ContactItem from "./ContactItem";

interface Props {
  onUsersSelected: (userIds: string[]) => void;
  onSearchQueryChange: (value: string) => void;
  onClose: () => void;
  previouslySelectedUsers: string[];
  contacts: User[];
}

const SelectUserForGroup: React.FC<Props> = ({
  onUsersSelected,
  onClose,
  contacts,
  onSearchQueryChange,
  previouslySelectedUsers
}) => {
  const [selectedUsers, setSelectedUsers] = useState<string[]>(previouslySelectedUsers);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    onSearchQueryChange(searchQuery);
  }, [searchQuery]);

  const onSelectUser = (userId: string) => {
    const users = [...selectedUsers];
    if (selectedUsers.includes(userId)) {
      users.splice(users.indexOf(userId), 1);
    } else {
      users.push(userId);
    }
    setSelectedUsers(users);
  };

  const handleSearchQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
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
          <input type="text" name="name" onChange={handleSearchQueryChange} placeholder="Type User Name" />
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
      <div className="suDoneBtnCtnr" onClick={() => onUsersSelected(selectedUsers)}>
        <span className="addic">
          <i className="fa-solid fa-check"></i>
        </span>
      </div>
    </div>
  );
};

export default SelectUserForGroup;
