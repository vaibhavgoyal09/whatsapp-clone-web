import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ReactComponent as StatusLogo } from "../assets/status.svg";
import CreateNewStatusDialog from "../components/CreateNewStatusDialog";
import StatusContactItem from "../components/StatusContactItem";
import ViewStatusesScreen from "../components/ViewStatusesScreen";
import { useAxios } from "../context/AxiosContext";
import "../css/statusScreenStyle.css";
import CreateStatusRequest from "../models/CreateStatusRequest";
import Status from "../models/Status";
import User from "../models/User";
import { WhatsApi } from "../utils/Constants";
import Utils from "../utils/Utils";

const StatusScreen = () => {
  const axios = useAxios()!;
  const [contacts, setContacts] = useState<User[]>([]);
  const [selectedContact, setSelectedContact] = useState<User | null>(null);
  const [statusesOfUser, setStatusesOfUser] = useState<Status[]>([]);
  const [showStatusesScreen, setShowStatusesScreen] = useState(false);
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
    setShowStatusesScreen(false);
    if (selectedContact) {
      setStatusesOfUser([]);
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
          setStatusesOfUser(statuses);
          setShowStatusesScreen(true);
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

  const handleCreateNewStatusClicked = (request: CreateStatusRequest) => {
    axios
      .postRequest(request, null, WhatsApi.CREATE_NEW_STATUS_URL)
      .then((result) => {
        setShowCreateNewStatusDialog(false);
        alert("Created Successfully");
      })
      .catch((e) => console.log(e));
  };

  const handleOnNextClicked = () => {
    let index = contacts.indexOf(selectedContact!);
    if (index === contacts.length - 1) {
      setShowStatusesScreen(false);
      setSelectedContact(null);
    } else {
      setSelectedContact(contacts[index + 1]);
    }
  };

  const handleOnPreviousClicked = () => {
    let index = contacts.indexOf(selectedContact!);
    if (index <= 0) {
      setShowStatusesScreen(false);
      setSelectedContact(null);
    } else {
      setSelectedContact(contacts[index - 1]);
    }
  };

  return (
    <div className="statusScreen">
      {showStatusesScreen ? (
        <ViewStatusesScreen
          onNextCliked={() => {
            handleOnNextClicked();
          }}
          onPreviousClicked={() => {
            handleOnPreviousClicked();
          }}
          currentContactUser={selectedContact!}
          statuses={statusesOfUser}
          onClose={() => {
            setShowStatusesScreen(false);
            setSelectedContact(null);
          }}
        />
      ) : null}
      <CreateNewStatusDialog
        isOpen={showCreateNewStatusDialog}
        onClose={() => setShowCreateNewStatusDialog(false)}
        onCreateNewStatusClicked={(request: CreateStatusRequest) =>
          handleCreateNewStatusClicked(request)
        }
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
                onClick={() => {
                  setSelectedContact(user);
                }}
              />
            ))}
          </div>
        </div>
        <div className="statusIntroContainer">
          <div>
            <StatusLogo className="sintroImg" />
            <h3 className="sintroTitle unselectable">
              Click on a contact to view their status updates
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusScreen;
