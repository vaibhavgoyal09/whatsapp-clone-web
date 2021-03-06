import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ChattingScreen from "../components/ChattingScreen";
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
            console.log(`${element} Type is ${typeof element}`);
            let message: Message | null = null;
            if (element.last_message !== null) {
              message = {
                id: element.last_message.id,
                senderId: element.last_message.sender_id,
                type: element.last_message.type,
                text: element.last_message.message,
                mediaUrl: element.last_message.media_url,
                chatId: element.last_message.chat_id,
                timestamp: element.last_message.created_at,
              }
            }
            let chat: Chat = {
              id: element.id,
              type: element.type,
              name: element.name,
              profileImageUrl: element.profile_image_url,
              groupId: element.group_id,
              users: element.users,
              lastMessage: message
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
    if (searchQuery !== null && searchQuery.length >= 1) {
      axios
        .getRequest(WhatsApi.SEARCH_USERS_BY_PHONE_NUMBER_URL, {
          phone_number: searchQuery,
        })
        .then((result: any) => {
          console.log(result);
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
    }
  }, [searchQuery]);

  useEffect(() => {
    if (contactNameSearchQuery !== null) {
      axios
        .getRequest(WhatsApi.SEARCH_CONTACTS_BY_NAME_URL, {
          name: contactNameSearchQuery,
        })
        .then((result: any) => {
          console.log(result);
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
    }
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
    if (chat && chat.type == ChatType.oneToOne) {
      let remoteUser = chat.users.filter((user: User) => {
        return user.id != axios.currentUserModel?.id;
      })[0];
      console.log(remoteUser.id);
      axios
        ?.getRequest(
          `${WhatsApi.GET_REMOTE_USER_DETAILS_URL}/${remoteUser.id}`,
          null
        )
        .then((result: any) => {
          let user: User = {
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
  const onSearchQueryChange = (value: string) => {
    setSearchQuery(value);
    console.log("search query changed");
  };
  const onContactClicked = (contact: User) => {
    var chatId = null;

    for (let i in chatsList) {
      let c = chatsList[i];
      let remoteUser = c.users.filter((user: User) => {
        return user.id != axios.currentUserModel?.id;
      })[0];
      chatId = remoteUser.id === contact.id ? c.id : null;
      if (!chatId) {
        continue;
      } else {
        setChat(c);
        break;
      }
    }
    if (!chatId) {
      axios
        .postRequest(
          null,
          { remote_user_id: contact.id },
          WhatsApi.CREATE_NEW_CHAT_URL
        )
        .then((result: any) => {
          let chat: Chat = {
            id: result.id,
            type: result.type,
            name: result.name,
            profileImageUrl: result.profile_image_url,
            groupId: result.group_id,
            users: result.users,
            lastMessage: null
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
