import Group from "../models/Group";
import "../css/groupDetailsScreenStyle.css";
import { ReactComponent as LinkSVG } from "../assets/link.svg";
import { ReactComponent as AddUserSVG } from "../assets/add_user.svg";

interface Props {
  group: Group | null;
  onClose: () => void;
}

const GroupDetailsScreen: React.FC<Props> = ({ group, onClose }) => {
  if (!group) {
    return null;
  }
  const defaultGroupAvatarImage = require("../assets/group_avatar.png");

  const users = group.users.sort((a, b) => {
    if (a.id === group.adminId) {
      return -1;
    } else if (b.id == group.adminId) {
      return 1;
    } else {
      return 0;
    }
  });

  console.log(users);

  return (
    <div className="gdContainer">
      <div className="gdHeaderCtnr">
        <span className="gdCloseBtn" onClick={() => onClose()}>
          <i className="fa-solid fa-xmark" />
        </span>
        <span className="gdTitle unselectable">
          <p>Group Info</p>
        </span>
      </div>
      <div className="gdBtmCtnr">
        <div className="gdimgCtnr">
          <img
            className="gdGroupProfilePic"
            src={
              group.profileImageUrl
                ? group.profileImageUrl
                : defaultGroupAvatarImage
            }
            alt="profile"
          />
        </div>
        <div className="gdGroupDetailsCtnr">
          <p className="gdGroupName unselectable">{group.name} </p>
          <p className="gdParticipantsCount unselectable">
            Group ·&nbsp; {group.users.length} participants
          </p>
        </div>
        <div className="gdPartcipantsCtnr">
          <span>Participants</span>
          <div className="gdPartActionsCtnr">
            <div className="gdPartAction unselectable">
              <div className="actIcCtnr">
                <AddUserSVG className="actIc" />
              </div>
              <div className="actName">Add participant</div>
            </div>
            <div className="gdPartAction unselectable">
              <div className="actIcCtnr">
                <LinkSVG className="actIc" />
              </div>
              <div className="actName">Invite to group via link</div>
            </div>
          </div>
          <div className="gdUsersContainer">
            {users.map((element) => (
              <div key={element.id} className="gdUserItemContainer">
                <img
                  className="gdUserProfilePic"
                  src={
                    element.profileImageUrl
                      ? element.profileImageUrl
                      : "avatar.png"
                  }
                  alt="profile"
                />
                <div className="dgUserDetailsContainer unselectable">
                  <div className="gdUserRole">
                    <p className="gdUserName">{element.name}</p>
                    {element.id === group.adminId ? (
                      <div className="gdrole">Group Admin</div>
                    ) : null}
                  </div>
                  <p className="gdUserAbout">{element.about}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
                <div className="gdOptionsContainer unselectable">
          <div className="gdOpCtnr">
            <div className="gdOpCtnt">
              <span className="gdWarnIcon">
                <i className="fa-solid fa-ban" />
              </span>
              <span className="gdOpAction">Leave Group</span>
            </div>
          </div>
          <div className="gdOpCtnr">
            <div className="gdOpCtnt">
              <span className="gdWarnIcon">
              <i className="fa-solid fa-thumbs-down"/>
              </span>
              <span className="gdOpAction">Report Group</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupDetailsScreen;
