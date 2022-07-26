import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ChattingScreen from "../components/ChattingScreen";
import EnterGroupDetailsScreen from "../components/EnterGroupDetailsScreen";
import MainSidebar from "../components/MainSidebar";
import RemoteUserProfilePreview from "../components/RemoteUserProfilePreview";
import SelectUsersForGroup from "../components/SelectUsersForGroup";
import StatusScreen from "../components/StatusScreen";
import UserSelfProfilePreview from "../components/UserSelfProfilePreview";
import WhatsappIntroScreen from "../components/WhatsappIntroScreen";
import { useAuth } from "../context/AuthContext";
import { useAxios } from "../context/AxiosContext";
import { useWhatsappWebSocket } from "../context/WhatsAppWebSocketContext";
import "../css/mainScreenStyle.css";
import Chat, { ChatType } from "../models/Chat";
import Message from "../models/Message";
import SendMessageRequest from "../models/SendMessageRequest";
import User from "../models/User";
import { WhatsApi } from "../utils/Constants";
import Utils from "../utils/Utils";

const MainScreen = () => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [remoteUser, setRemoteUser] = useState<User | null>(null);
  const [contactsList, setContactsList] = useState<User[]>([]);
  const [chatsList, setChatsList] = useState<Chat[]>([]);
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const [showSelfProfileScreen, setShowSelfProfileScreen] =
    useState<boolean>(false);
  const [showRemoteUserProfileScreen, setShowRemoteUserProfileScreen] =
    useState<boolean>(false);
  const [showSelectUsersForGroup, setShowSelectUsersForGroup] =
    useState<boolean>(false);
  const [showCreateGroupSidebar, setShowCreateGroupSidebar] =
    useState<boolean>(false);
  const [contactNameSearchQuery, setContactNameSearchQuery] = useState<
    string | null
  >(null);
  const [showStatusScreen, setShowStatusScreen] = useState<boolean>(false);
  const [messagesListForChat, setMessagesListForChat] = useState<Message[]>([]);
  const [usersToAddInGroup, setUsersToAddInGroup] = useState<string[]>([]);
  const navigate = useNavigate();
  const auth = useAuth()!;
  const webSockets = useWhatsappWebSocket()!;
  const axios = useAxios()!;

  useEffect(() => {
    if (axios.accessToken) {
      axios
        .getRequest(WhatsApi.GET_ALL_CHATS_URL, null)
        .then((result: any) => {
          console.log(result);
          let chats: Chat[] = [];
          result.forEach((element: any) => {
            chats.push(Utils.chatFromJson(element));
          });
          setChatsList(chats);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [axios.accessToken]);

  useEffect(() => {
    if (searchQuery !== null && searchQuery.length >= 1) {
      axios
        .getRequest(WhatsApi.SEARCH_USERS_BY_PHONE_NUMBER_URL, {
          phone_number: searchQuery,
        })
        .then((result: any) => {
          let contacts: User[] = [];
          result.forEach((element: any) => {
            contacts.push(Utils.userFromJson(element));
          });
          setContactsList(contacts);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [searchQuery]);

  useEffect(() => {
    if (contactNameSearchQuery !== null) {
      axios
        .getRequest(WhatsApi.SEARCH_CONTACTS_BY_NAME_URL, {
          name: contactNameSearchQuery,
        })
        .then((result: any) => {
          let contacts: User[] = [];
          result.forEach((element: any) => {
            contacts.push(Utils.userFromJson(element));
          });
          setContactsList(contacts);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [contactNameSearchQuery]);

  useEffect(() => {
    if (chat) {
      axios
        .getRequest(`${WhatsApi.GET_MESSAGES_FOR_CHAT_URL}/${chat.id}`, null)
        .then((result: any) => {
          let messages: Message[] = [];
          for (let message of result) {
            messages.push(Utils.messageFromJson(message));
          }
          setMessagesListForChat(messages.reverse());
        })
        .catch((e) => console.log(e));
    }
  }, [chat]);

  useEffect(() => {
    if (chat && chat.type === ChatType.oneToOne) {
      let remoteUser = chat.users.filter((user: User) => {
        return user.id !== axios.currentUserModel?.id;
      })[0];
      axios
        ?.getRequest(
          `${WhatsApi.GET_REMOTE_USER_DETAILS_URL}/${remoteUser.id}`,
          null
        )
        .then((result: any) => {
          setRemoteUser(Utils.userFromJson(result));
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
      setMessagesListForChat(mList.reverse());
    }
  }, [webSockets.lastChatMessage]);

  const onChatClick = (chat: Chat) => {
    setShowRemoteUserProfileScreen(false);
    setChat(chat);
  };
  const onSearchQueryChange = (value: string) => {
    setSearchQuery(value);
  };
  const onContactClicked = (contact: User) => {
    let chat = chatsList.filter((chat: Chat) => {
      let remoteUser = Utils.getRemoteUserFromChat(chat, axios.currentUserModel!.id);
      return remoteUser.id === contact.id
    })[0];
    setChat(chat);
    
    if (!chat) {
      axios
        .postRequest(
          null,
          { remote_user_id: contact.id },
          WhatsApi.CREATE_NEW_CHAT_URL
        )
        .then((result: any) => {
          let chat: Chat = Utils.chatFromJson(result);
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
    webSockets?.sendChatMessage(request);
  };
  const handleCreateNewGroup = (name: string, imageFile: File | null) => {};
  const handleSelectUsersForGroup = () => {
    setContactNameSearchQuery("");
    setShowSelectUsersForGroup(true);
  };
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

  const searchContactsByName = (name: string) => {
    setContactNameSearchQuery(name);
  };

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
      onCreateNewGroupClicked={() => handleSelectUsersForGroup()}
      onLogOutClicked={() => handleLogOut()}
      selectedChat={chat}
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
        onUsersSelected={(userIds: string[]) => {
          setShowSelectUsersForGroup(false);
          setUsersToAddInGroup(userIds);
          setShowCreateGroupSidebar(true);
        }}
        previouslySelectedUsers={usersToAddInGroup}
        onClose={() => setShowSelectUsersForGroup(false)}
        onSearchQueryChange={(value: string) => searchContactsByName(value)}
        contacts={contactsList}
      />
    );
  } else if (showCreateGroupSidebar) {
    sidebarComponent = (
      <EnterGroupDetailsScreen
        onDone={(name: string, imageFile: File | null) => {
          handleCreateNewGroup(name, imageFile);
        }}
        onClose={() => {
          setShowSelectUsersForGroup(true);
          setShowCreateGroupSidebar(false);
        }}
      />
    );
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
