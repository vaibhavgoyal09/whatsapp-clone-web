import User from "../models/User";
import Status from "../models/Status";
import { useAxios } from "../context/AxiosContext";
import "../css/statusScreenStyle.css";
import { ReactComponent as StatusLogo } from "../assets/status.svg";
import { useEffect, useState } from "react";
import StatusContactItem from "../components/StatusContactItem";
import { WhatsApi } from "../utils/Constants";
import Utils from "../utils/Utils";
import { useNavigate } from "react-router-dom";
import AddStatusRequest from "../models/AddStatusRequest";
import StatusDisplayScreen from "../components/StatusDisplayScreen";
import CreateNewStatusDialog from "../components/CreateNewStatusDialog";

const StatusScreen = () => {
  const axios = useAxios()!;
  const [contacts, setContacts] = useState<User[]>([]);
  const [selectedContact, setSelectedContact] = useState<User | null>(null);
  const [statusesOfUser, setStatusesOfUser] = useState<Status[]>([]);
  const [showCreateNewStatusDialog, setShowCreateNewStatusDialog] =
    useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .getRequest(WhatsApi.GET_ALL_USERS_WITH_ACTIVE_STATUS_URL, null)
      .then((result) => {
        let list: User[] = [];
        result.forEach((userJson: any) => {
          if (userJson.id === axios.currentUserModel?.id) {
            return;
          }
          list.push(Utils.userFromJson(userJson));
        });
        setContacts(list);
      })
      .catch((e) => console.log(e));
  }, []);

  useEffect(() => {
    if (selectedContact) {
      axios
        .getRequest(
          `${WhatsApi.GET_STATUSES_OF_USER_URL}/${selectedContact.id}`,
          null
        )
        .then((result) => {
          let statuses: Status[] = [];
          result.forEach((item: any) => {
            statuses.push(Utils.statusFromJson(item));
          });
        })
        .catch((e) => console.log(e));
    }
  }, [selectedContact]);

  const handleCloseButtonClicked = () => {
    navigate("/");
  };

  const handleAddStatusButtonClicked = () => {
    setShowCreateNewStatusDialog(true);
  };

  return (
    <div className="statusScreen">
      <CreateNewStatusDialog
        isOpen={showCreateNewStatusDialog}
        onClose={() => setShowCreateNewStatusDialog(false)}
      />
      <div className="statusScreenContent">
        {showCreateNewStatusDialog ? null : (
          <span id="statusCloseBtn" onClick={() => handleCloseButtonClicked()}>
            <i className="fa-solid fa-xmark"></i>
          </span>
        )}
        <div className="statusSidebar">
          <div className="statusSidebarHeader">
            <img
              className="sselfProfilePreview"
              src={
                axios.currentUserModel?.profileImageUrl
                  ? axios.currentUserModel.profileImageUrl
                  : "avatar.png"
              }
            />
            <div>
              <p id="myStatusText">My Status</p>
            </div>
            <span
              id="addStatusIcon"
              onClick={() => handleAddStatusButtonClicked()}
            >
              <i className="fa-solid fa-plus"></i>
            </span>
          </div>
          <p id="textRecent">Recents</p>
          <div className="sUsersContainer">
            {contacts.map((user) => (
              <StatusContactItem
                key={user.id}
                contact={user}
                isSelected={selectedContact?.id === user.id}
                onClick={() => {
                  setSelectedContact(user);
                }}
              />
            ))}
          </div>
        </div>
        {selectedContact ? (
          <div className="statusDisplayScreen">
            <StatusDisplayScreen statuses={statusesOfUser} />
          </div>
        ) : (
          <div className="statusIntroContainer">
            <div>
              <StatusLogo className="sintroImg" />
              <h3 className="sintroTitle unselectable">
                Click on a contact to view their status updates
              </h3>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusScreen;
