import { useEffect, useState } from "react";
import ChattingScreen from "../components/ChattingScreen";
import MainSidebar from "../components/MainSidebar";
import WhatsappIntroScreen from "../components/WhatsappIntroScreen";
import { useAuth } from "../context/AuthContext";
import { useAxios } from "../context/AxiosContext";
import { useWhatsappWebSocket } from "../context/WhatsAppWebSocketContext";
import "../css/mainScreenStyle.css";
import UserSelfProfilePreview from "../components/UserSelfProfilePreview";
import RemoteUserProfilePreview from "../components/RemoteUserProfilePreview";
import StatusScreen from "../components/StatusScreen";
import { useNavigate } from "react-router-dom";

const MainScreen = () => {
  const [chat, setChat] = useState(null);
  const [remoteUser, setRemoteUser] = useState(null);
  const [contactsList, setContactsList] = useState([]);
  const [chatsList, setChatsList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSelfProfileScreen, setShowSelfProfileScreen] = useState(false);
  const [showRemoteUserProfileScreen, setShowRemoteUserProfileScreen] =
    useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showStatusScreen, setShowStatusScreen] = useState(false);
  const [messagesListForChat, setMessagesListForChat] = useState([]);
  const navigate = useNavigate();
  const { currentUser, logOut } = useAuth();
  const { sendChatMessage, lastChatMessage } = useWhatsappWebSocket();
  const {
    currentUserModel,
    getAllChats,
    searchUsers,
    getMessagesForChat,
    createNewChat,
    updateUserDetails,
    updateCurrentUserModelState,
    getRemoteUserDetails,
    accessToken,
    createNewGroup,
  } = useAxios();

  useEffect(() => {
    if (accessToken) {
      getAllChats()
        .then((result) => {
          let chats = [];
          result.forEach((element) => {
            let chat = {
              id: element.id,
              remoteUserId: element.remote_user_id,
              remoteUserProfileImageUrl: element.remote_user_profile_image_url,
              remoteUserName: element.remote_user_name,
              lastMessage: element.last_message,
              unseenMessageCount: element.unseen_message_count,
            };
            chats.push(chat);
          });
          setChatsList(chats);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [accessToken]);

  useEffect(() => {
    if (searchQuery === "") {
    } else {
      searchUsers(searchQuery)
        .then((result) => {
          console.log(result);
          let contacts = [];
          result.forEach((element) => {
            let c = {
              id: element.id,
              name: element.name,
              about: element.about,
              firebaseUid: element.firebase_uid,
              phoneNumber: element.phone_number,
              profileImageUrl: element.profile_image_url,
            };
            contacts.push(c);
          });
          setContactsList(contacts);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [searchQuery]);

  useEffect(() => {
    if (chat) {
      getMessagesForChat(chat.getId())
        .then((result) => {
          let messages = [];
          for (let i in result) {
            let m = result[i];
            let message = {
              id: m.id,
              senderId: m.sender_id,
              type: m.type,
              text: m.message,
              mediaUrl: m.media_url,
              chatId: m.chat_id,
              timestamp: m.created_at,
            };
            messages.push(message);
          }
          setMessagesListForChat(messages.reverse());
        })
        .catch((e) => console.log(e));
    }
  }, [chat]);

  useEffect(() => {
    if (chat) {
      getRemoteUserDetails(chat.remoteUserId).then((result) => {
        let user = {
          id: result.id,
          name: result.name,
          about: result.about,
          firebaseUid: result.firebase_uid,
          phoneNumber: result.phone_number,
          profileImageUrl: result.profile_image_url,
        };
        setRemoteUser(user);
      });
    }
  }, [chat]);

  useEffect(() => {
    if (lastChatMessage && chat.id === lastChatMessage.chatId) {
      let mList = [...messagesListForChat.reverse()];
      mList.push(lastChatMessage);
      console.log(mList);
      setMessagesListForChat(mList.reverse());
    }
  }, [lastChatMessage]);

  const onChatClick = (chat) => {
    setShowRemoteUserProfileScreen(false);
    setChat(chat);
  };
  const onSearchQueryChange = (value) => setSearchQuery(value);
  const onContactClicked = (contact) => {
    var chatId = null;

    for (let i in chatsList) {
      let c = chatsList[i];
      console.log(`Chat ID ${c}`);
      console.log(`Contact ID ${contact.id}`);
      chatId = c.remoteUserId === contact.id ? c.id : null;
      if (!chatId) {
        continue;
      } else {
        setChat(c);
        break;
      }
    }
    if (!chatId) {
      createNewChat(contact.getId())
        .then((result) => {
          let chat = {
            id: result.id,
            remoteUserId: contact.getId(),
            remoteUserProfileImageUrl: contact.getProfileImageUrl(),
            remoteUserName: contact.getName(),
            lastMessage: null,
            unseenMessageCount: 0,
          };
          setChat(chat);
          let chats = [...chatsList];
          chats.push(chat);
          setChatsList(chats);
        })
        .catch((e) => console.log(e));
    }
  };
  const onRemoteUserProfileClick = () => {
    setShowRemoteUserProfileScreen(true);
  };
  const onUserSelfProfileClick = () => {
    setShowSelfProfileScreen(true);
  };
  const updateUserName = (name) => {
    updateUserDetails({
      name: name,
      about: null,
      profileImageFile: null,
      shouldRemoveProfileImage: false,
    })
      .then((_) => {
        updateCurrentUserModelState(name, null, null);
      })
      .catch((e) => console.log(e));
  };
  const updateUserAbout = (about) => {
    updateUserDetails({
      name: null,
      about: about,
      profileImageFile: null,
      shouldRemoveProfileImage: false,
    })
      .then((_) => {
        updateCurrentUserModelState(null, about, null);
      })
      .catch((e) => console.log(e));
  };
  const updateUserProfileImage = (imageFile, shouldRemoveProfileImage) => {
    updateUserDetails({
      name: null,
      about: null,
      profileImageFile: imageFile,
      shouldRemoveProfileImage: shouldRemoveProfileImage,
    })
      .then((result) => {
        updateCurrentUserModelState(null, null, result);
      })
      .catch((e) => console.log(e));
  };
  const handleSendChatMessage = (request) => {
    console.log(`Send Message Request: ${request}`);
    sendChatMessage(request);
  };
  const handleCreateNewGroup = () => {};
  const handleLogOut = () => {
    logOut()
      .then((_) => {
        navigate("/auth");
      })
      .catch((e) => console.log(e));
  };

  return (
    <div className="pg">
      {showStatusScreen ? <StatusScreen /> : null}
      <div className="sidebarContainer">
        {showSelfProfileScreen ? (
          <UserSelfProfilePreview
            currentUserModel={currentUserModel}
            onClose={() => setShowSelfProfileScreen(false)}
            updateUserName={(name) => {
              updateUserName(name);
            }}
            updateUserAbout={(about) => updateUserAbout(about)}
            updateUserProfileImage={(imageFile, shouldRemoveProfileImage) =>
              updateUserProfileImage(imageFile, shouldRemoveProfileImage)
            }
          />
        ) : (
          <MainSidebar
            currentUserModel={currentUserModel}
            chatsList={chatsList}
            onProfileClick={onUserSelfProfileClick}
            onChatClicked={(chat) => onChatClick(chat)}
            onSearchQueryChange={(value) => onSearchQueryChange(value)}
            contactsList={contactsList}
            onShowStatusScreen={() => setShowStatusScreen(true)}
            onContactClicked={(contact) => onContactClicked(contact)}
            onCreateNewGroupClicked={() => handleCreateNewGroup()}
            onLogOutClicked={() => handleLogOut()}
          />
        )}
      </div>
      {chat ? (
        <div
          className={
            showRemoteUserProfileScreen
              ? "chattingContainer small"
              : "chattingContainer max"
          }
        >
          <ChattingScreen
            currentUserModel={currentUserModel}
            chat={chat}
            onProfileClick={() => {
              onRemoteUserProfileClick();
            }}
            messages={messagesListForChat}
            onSendMessage={(request) => handleSendChatMessage(request)}
          />
        </div>
      ) : (
        <div className="whatsappIntroContainer">
          <WhatsappIntroScreen />
        </div>
      )}
      {showRemoteUserProfileScreen ? (
        <div className="remoteUserProfileContainer">
          <RemoteUserProfilePreview
            user={remoteUser}
            onClose={() => setShowRemoteUserProfileScreen(false)}
          />
        </div>
      ) : null}
    </div>
  );
};

export default MainScreen;
