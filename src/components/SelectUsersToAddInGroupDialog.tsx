import { useEffect, useState } from "react";
import "../css/selectUsersForGroupDialogStyle.css";
import User from "../models/User";
import ContactItem from "./ContactItem";

interface Props {
  showDialog: boolean;
  onDoneClicked: (selectedUsers: string[]) => void;
  onClose: () => void;
  usersList: User[];
}

const SelectUsersToAddInGroupDialog: React.FC<Props> = ({
  showDialog,
  onClose,
  usersList,
  onDoneClicked
}) => {

  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  useEffect(() => {
    console.log(selectedUsers);
  }, []);

  if (!showDialog) {
    return null;
  }

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
    <div className="sudOverlay" onClick={() => onClose()}>
      <div className="sudDialog-container" onClick={(e) => e.stopPropagation()}>
        <div className="sudHeader">
          <span className="sudCloseBtn" onClick={() => onClose()}>
            <i className="fa-solid fa-xmark" />
          </span>
          <span className="sudTitle unselectable">
            <p>Add participants</p>
          </span>
        </div>
        <div className="sudUsersContainer">
          {usersList.map((element) => (
            <ContactItem
            key={element.id}
            contact={element}
            onClick={() => onSelectUser(element.id)}
            isSelected={selectedUsers.includes(element.id)}
          />
          ))}
        </div>
        <div className="usdDoneBtnCtnr" onClick={() => onDoneClicked(selectedUsers)}>
        <span className="addic">
          <i className="fa-solid fa-check"/>
        </span>
      </div>
      </div>
    </div>
  );
};

export default SelectUsersToAddInGroupDialog;
