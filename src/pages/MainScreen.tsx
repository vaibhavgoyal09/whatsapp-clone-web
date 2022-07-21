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
import Chat from "../models/Chat";
import User from "../models/User";
import Message from "../models/Message";
import { WhatsApi } from "../utils/Constants";
import SendMessageRequest from "../models/SendMessageRequest";
import SelectUsersForGroup from "../components/SelectUsersForGroup";

const MainScreen = () => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [remoteUser, setRemoteUser] = useState<User | null>(null);
  const [contactsList, setContactsList] = useState<User[]>([]);
  const [chatsList, setChatsList] = useState<Chat[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showSelfProfileScreen, setShowSelfProfileScreen] =
    useState<boolean>(false);
  const [showRemoteUserProfileScreen, setShowRemoteUserProfileScreen] =
    useState<boolean>(false);
  const [showSelectUsersForGroup, setShowSelectUsersForGroup] =
    useState<boolean>(true);
  const [showCreateGroupSidebar, setShowCreateGroupSidebar] =
    useState<boolean>(true);
  const [contactNameSearchQuery, setContactNameSearchQuery] = useState<string>("");
  const [showStatusScreen, setShowStatusScreen] = useState<boolean>(false);
  const [messagesListForChat, setMessagesListForChat] = useState<Message[]>([]);
  const navigate = useNavigate();
  const auth = useAuth()!;
  const webSockets = useWhatsappWebSocket()!;
  const axios = useAxios()!;

  useEffect(() => {
    if (axios.accessToken) {
      axios
        .getRequest(WhatsApi.GET_ALL_CHATS_URL, null)
        .then((result: any) => {
          let chats: Chat[] = [];
          result.forEach((element: any) => {
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
  }, [axios.accessToken]);

  useEffect(() => {
    axios
      .getRequest(WhatsApi.SEARCH_USERS_BY_PHONE_NUMBER_URL, {
        phone_number: searchQuery,
      })
      .then((result: any) => {
        let contacts: User[] = [];
        result.forEach((element: any) => {
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
  }, [searchQuery]);

  useEffect(() => {
    axios
      .getRequest(WhatsApi.SEARCH_CONTACTS_BY_NAME_URL, {
        name: contactNameSearchQuery,
      })
      .then((result: any) => {
        let contacts: User[] = [];
        result.forEach((element: any) => {
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
  }, [contactNameSearchQuery]);

  useEffect(() => {
    if (chat) {
      axios
        .getRequest(`${WhatsApi.GET_MESSAGES_FOR_CHAT_URL}/${chat.id}`, null)
        .then((result: any) => {
          let messages: Message[] = [];
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
      axios
        ?.getRequest(
          `${WhatsApi.GET_REMOTE_USER_DETAILS_URL}/${chat.remoteUserId}`,
          null
        )
        .then((result: any) => {
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
    if (
      webSockets.lastChatMessage &&
      chat?.id === webSockets.lastChatMessage.chatId
    ) {
      let mList: Message[] = [...messagesListForChat.reverse()];
      mList.push(webSockets.lastChatMessage);
      console.log(mList);
      setMessagesListForChat(mList.reverse());
    }
  }, [webSockets.lastChatMessage]);

  const onChatClick = (chat: Chat) => {
    setShowRemoteUserProfileScreen(false);
    setChat(chat);
  };
  const onSearchQueryChange = (value: string) => setSearchQuery(value);
  const onContactClicked = (contact: User) => {
    var chatId = null;

    for (let i in chatsList) {
      let c = chatsList[i];
      chatId = c.remoteUserId === contact.id ? c.id : null;
      if (!chatId) {
        continue;
      } else {
        setChat(c);
        break;
      }
    }
    if (!chatId) {
      axios
        ?.postRequest(
          null,
          { remote_user_id: contact.id },
          WhatsApi.CREATE_NEW_CHAT_URL
        )
        .then((result: any) => {
          let chat: Chat = {
            id: result.id,
            remoteUserId: contact.id,
            remoteUserProfileImageUrl: contact.profileImageUrl,
            remoteUserName: contact.name,
            lastMessage: null,
            unseenMessageCount: 0,
          };
          setChat(chat);
          let chats = [...chatsList];
          chats.push(chat);
          setChatsList(chats);
        })
        .catch((e: any) => console.log(e));
    }
  };
  const onRemoteUserProfileClick = () => {
    setShowRemoteUserProfileScreen(true);
  };
  const onUserSelfProfileClick = () => {
    setShowSelfProfileScreen(true);
  };

  const updateUserDetails = async (
    name: string | null = null,
    about: string | null = null,
    imageFile: File | null = null,
    shouldRemoveProfileImage: boolean = false
  ) => {
    let profileImageUrl: string | undefined | null = null;
    if (imageFile) {
      profileImageUrl = await axios.uploadFile(imageFile);
    }
    await axios.putRequest(
      {
        name: name,
        about: about,
        profile_image_url: profileImageUrl,
        should_remove_profile_image: shouldRemoveProfileImage,
      },
      null,
      WhatsApi.UPDATE_USER_DETAILS_URL
    );
  };

  const updateUserName = (name: string) => {
    updateUserDetails(name)
      .then((_) => {
        axios.updateCurrentUserModelState(name);
      })
      .catch((e) => console.log(e));
  };
  const updateUserAbout = (about: string) => {
    updateUserDetails(null, about)
      .then((_) => {
        axios.updateCurrentUserModelState(undefined, about);
      })
      .catch((e) => console.log(e));
  };
  const updateUserProfileImage = (
    imageFile: File | null,
    shouldRemoveProfileImage: boolean
  ) => {
    updateUserDetails(null, null, imageFile, shouldRemoveProfileImage)
      .then((result: any) => {
        axios.updateCurrentUserModelState(undefined, undefined, result);
      })
      .catch((e: any) => console.log(e.message));
  };
  const handleSendChatMessage = (request: SendMessageRequest) => {
    console.log(`Send Message Request: ${request}`);
    webSockets?.sendChatMessage(request);
  };
  const handleCreateNewGroup = () => { };
  const handleLogOut = () => {
    auth
      .logOut()
      .then((_) => {
        navigate("/auth");
      })
      .catch((e) => console.log(e));
  };

  if (!axios.currentUserModel) {
    return null;
  }

  const searchContactsByName = (name: string) => { setContactNameSearchQuery(name) };

  let sidebarComponent: JSX.Element = (
    <MainSidebar
      currentUserModel={axios.currentUserModel}
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
  );

  if (showSelfProfileScreen) {
    sidebarComponent = (
      <UserSelfProfilePreview
        currentUserModel={axios.currentUserModel}
        onClose={() => setShowSelfProfileScreen(false)}
        updateUserName={(name) => {
          updateUserName(name);
        }}
        updateUserAbout={(about) => updateUserAbout(about)}
        updateUserProfileImage={(imageFile, shouldRemoveProfileImage) =>
          updateUserProfileImage(imageFile, shouldRemoveProfileImage)
        }
      />
    );
  } else if (showSelectUsersForGroup) {
    sidebarComponent = (
      <SelectUsersForGroup
        onUsersSelected={(userIds: number[]) => { }}
        onClose={() => setShowSelectUsersForGroup(false)}
        contacts={contactsList}
      />
    );
  } else if (showCreateGroupSidebar) {
  }

  return (
    <div className="pg">
      {showStatusScreen ? <StatusScreen /> : null}
      <div className="sidebarContainer">{sidebarComponent}</div>
      {chat ? (
        <div
          className={
            showRemoteUserProfileScreen
              ? "chattingContainer small"
              : "chattingContainer max"
          }
        >
          <ChattingScreen
            currentUserModel={axios.currentUserModel}
            chat={chat}
            onProfileClick={() => {
              onRemoteUserProfileClick();
            }}
            messages={messagesListForChat}
            onSendMessage={(request: SendMessageRequest) =>
              handleSendChatMessage(request)
            }
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
            user={remoteUser!}
            onClose={() => setShowRemoteUserProfileScreen(false)}
          />
        </div>
      ) : null}
    </div>
  );
};

export default MainScreen;
