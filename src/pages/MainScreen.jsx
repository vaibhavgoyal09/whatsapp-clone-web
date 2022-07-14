import { useEffect, useState } from "react";
import ChattingScreen from "../components/ChattingScreen";
import MainSidebar from "../components/MainSidebar";
import WhatsappIntroScreen from "../components/WhatsappIntroScreen";
import { useAuth } from "../context/AuthContext";
import { useAxios } from "../context/AxiosContext";
import { useWhatsappWebSocket } from "../context/WhatsAppWebSocketContext";
import "../css/mainScreenStyle.css";
import Chat from "../models/Chat";
import User from "../models/User";
import Message from "../models/Message";
import UserSelfProfilePreview from "../components/UserSelfProfilePreview";
import UpdateUserRequest from "../models/UpdateUserRequest";
import RemoteUserProfilePreview from "../components/RemoteUserProfilePreview";

const MainScreen = () => {
  const { currentUser } = useAuth();
  const [chat, setChat] = useState(null);
  const [remoteUser, setRemoteUser] = useState(null);
  const [contactsList, setContactsList] = useState([]);
  const [chatsList, setChatsList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSelfProfileScreen, setShowSelfProfileScreen] = useState(false);
  const [showRemoteUserProfileScreen, setShowRemoteUserProfileScreen] =
    useState(false);
  const [messagesListForChat, setMessagesListForChat] = useState([]);
  const {
    currentUserModel,
    getAllChats,
    searchUsers,
    getMessagesForChat,
    createNewChat,
    updateUserDetails,
    updateCurrentUserModelState,
    getRemoteUserDetails,
    accessToken
  } = useAxios();
  const { sendChatMessage, lastChatMessage } = useWhatsappWebSocket();

  useEffect(() => {
    if (accessToken) {
      getAllChats()
        .then((result) => {
          let chats = [];
          result.forEach((element) => {
            let chat = new Chat(
              element.id,
              element.remote_user_id,
              element.remote_user_profile_image_url,
              element.remote_user_name,
              null,
              element.unseen_message_count
            );
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
            let c = new User(
              element.id,
              element.name,
              element.about,
              element.firebase_uid,
              element.phone_number,
              element.profile_image_url
            );
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
            let message = new Message(
              m.id,
              m.sender_id,
              m.type,
              m.message,
              m.media_url,
              m.chat_id,
              m.created_at
            );
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
        let user = new User(
          result.id,
          result.name,
          result.about,
          result.firebase_uid,
          result.phone_number,
          result.profile_image_url
        );
        setRemoteUser(user);
      });
    }
  }, [chat]);

  useEffect(() => {
    console.log(lastChatMessage);
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
  }
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
          let chat = new Chat(
            result.id,
            contact.getId(),
            contact.getProfileImageUrl(),
            contact.getName(),
            null,
            0
          );
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
    updateUserDetails(new UpdateUserRequest(name, null, null, false))
      .then((_) => {
        updateCurrentUserModelState(name, null, null);
      })
      .catch((e) => console.log(e));
  };
  const updateUserAbout = (about) => {
    updateUserDetails(new UpdateUserRequest(null, about, null, false))
      .then((_) => {
        updateCurrentUserModelState(null, about, null);
      })
      .catch((e) => console.log(e));
  };
  const updateUserProfileImage = (imageFile, shouldRemoveProfileImage) => {
    updateUserDetails(
      new UpdateUserRequest(null, null, imageFile, shouldRemoveProfileImage)
    )
      .then((result) => {
        updateCurrentUserModelState(null, null, result);
      })
      .catch((e) => console.log(e));
  };
  const handleSendChatMessage = (request) => {
    console.log(`Send Message Request: ${request}`);
    sendChatMessage(request);
  };

  return (
    <div className="pg">
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
            onContactClicked={(contact) => onContactClicked(contact)}
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
