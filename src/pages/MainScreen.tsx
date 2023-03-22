import React, { Suspense, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAxios } from "../context/AxiosContext";
import { useWhatsappWebSocket } from "../context/WhatsAppWebSocketContext";
import "../css/mainScreenStyle.css";
import Chat, { ChatType } from "../models/Chat";
import Group from "../models/Group";
import Message from "../models/Message";
import SendMessageRequest from "../models/SendMessageRequest";
import User from "../models/User";
import { WhatsApi } from "../utils/Constants";
import Utils from "../utils/Utils";

import { AnimatePresence, motion } from "framer-motion";
import SplashScreen from "../components/SplashScreen";
import AddRemoveParticipantsRequest from "../models/AddRemoveParticipantsRequest";
import RemoveParticipantsRequest from "../models/RemoveParticipantsRequest";
import {
  componentLeftToRight,
  componentRightToLeft,
} from "../utils/Transitions";
import DefaultFallback from "../components/DefaultFallback";

const WhatsappIntroScreen = React.lazy(
  () => import("../components/WhatsappIntroScreen")
);
const LoadingBar = React.lazy(() => import("react-top-loading-bar"));
const ChattingScreen = React.lazy(() => import("../components/ChattingScreen"));
const MainSidebar = React.lazy(() => import("../components/MainSidebar"));
const SelectUsersForGroup = React.lazy(
  () => import("../components/SelectUsersForGroup")
);
const UserSelfProfilePreview = React.lazy(
  () => import("../components/UserSelfProfilePreview")
);
const GroupDetailsScreen = React.lazy(
  () => import("../components/GroupDetailsScreen")
);
const SelectUsersToAddInGroupDialog = React.lazy(
  () => import("../components/SelectUsersToAddInGroupDialog")
);
const RemoteUserProfilePreview = React.lazy(
  () => import("../components/RemoteUserProfilePreview")
);
const EnterGroupDetailsScreen = React.lazy(
  () => import("../components/EnterGroupDetailsScreen")
);

const IncomingCallPopup = React.lazy(
  () => import("../components/IncomingCallPopup")
);

const MainScreen = () => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [remoteUser, setRemoteUser] = useState<User | null>(null);
  const [contactsList, setContactsList] = useState<User[]>([]);
  const [chatsList, setChatsList] = useState<Chat[]>([]);
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const [showSelfProfileScreen, setShowSelfProfileScreen] =
    useState<boolean>(false);
  const [showChatDetailsScreen, setshowChatDetailsScreen] =
    useState<boolean>(false);
  const [showSelectUsersForGroup, setShowSelectUsersForGroup] =
    useState<boolean>(false);
  const [showCreateGroupSidebar, setShowCreateGroupSidebar] =
    useState<boolean>(false);
  const [contactNameSearchQuery, setContactNameSearchQuery] = useState<
    string | null
  >(null);
  const [showSelectUsersForGroupDialog, setShowSelectUsersForGroupDialog] =
    useState<boolean>(false);
  const [groupDetails, setGroupDetails] = useState<Group | null>(null);
  const [messagesListForChat, setMessagesListForChat] = useState<Message[]>([]);
  const [usersToAddInGroup, setUsersToAddInGroup] = useState<string[]>([]);
  const [showSplashScreen, setShowSplashScreen] = useState<boolean>(true);
  const navigate = useNavigate();
  const auth = useAuth()!;
  const webSockets = useWhatsappWebSocket()!;
  const axios = useAxios()!;
  const progressStatus = axios.progressStatus;

  useEffect(() => {
    setshowChatDetailsScreen(false);
  }, [chat]);

  useEffect(() => {
    let isSubscribed = false;
    if (axios.accessToken && !isSubscribed) {
      axios
        .getRequest(WhatsApi.GET_ALL_CHATS_URL, null)
        .then((result: any) => {
          isSubscribed = true;
          let chats: Chat[] = [];
          result.forEach((element: any) => {
            chats.push(Utils.chatFromJson(element));
          });
          setShowSplashScreen(false);
          setChatsList(chats);
        })
        .catch((e) => {
          console.log(e);
        });
    }
    return () => {
      isSubscribed = false;
    };
  }, [axios.accessToken]);

  useEffect(() => {
    let isSubscribed = false;
    if (searchQuery !== null && searchQuery.length >= 1 && !isSubscribed) {
      axios
        .getRequest(WhatsApi.SEARCH_USERS_BY_PHONE_NUMBER_URL, {
          phone_number: searchQuery,
        })
        .then((result: any) => {
          isSubscribed = true;
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
    return () => {
      isSubscribed = false;
    };
  }, [searchQuery]);

  useEffect(() => {
    let isSubscribed = false;
    if (contactNameSearchQuery !== null && !isSubscribed) {
      axios
        .getRequest(WhatsApi.SEARCH_CONTACTS_BY_NAME_URL, {
          name: contactNameSearchQuery,
        })
        .then((result: any) => {
          isSubscribed = true;
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
    return () => {
      isSubscribed = false;
    };
  }, [contactNameSearchQuery]);

  useEffect(() => {
    let isSubscribed = false;
    if (chat && !isSubscribed) {
      axios
        .getRequest(`${WhatsApi.GET_MESSAGES_FOR_CHAT_URL}/${chat.id}`, null)
        .then((result: any) => {
          isSubscribed = true;
          let messages: Message[] = [];
          for (let message of result) {
            messages.push(Utils.messageFromJson(message));
          }
          setMessagesListForChat(messages.reverse());
        })
        .catch((e) => console.log(e));
    }
    return () => {
      isSubscribed = false;
    };
  }, [chat]);

  useEffect(() => {
    let isSubscribed = false;
    if (chat && !isSubscribed) {
      if (chat.type === ChatType.oneToOne) {
        let remoteUserId = Utils.getRemoteUserIdFromChat(
          chat,
          axios.currentUserModel!.id
        );
        axios
          ?.getRequest(
            `${WhatsApi.GET_REMOTE_USER_DETAILS_URL}/${remoteUserId}`,
            null
          )
          .then((result: any) => {
            isSubscribed = true;
            setRemoteUser(Utils.userFromJson(result));
          })
          .catch((e) => console.log(e.message));
      } else if (chat.type === ChatType.group) {
        if (!chat.groupId) {
          return;
        }
        isSubscribed = true;
        getGroupDetails();
      }
    }
    return () => {
      isSubscribed = false;
    };
  }, [chat]);

  useEffect(() => {
    let isSubscribed = false;
    let status = webSockets.typingStatusChange;
    if (status && !isSubscribed) {
      console.log("Typing Status Change Received");
      chatsList.map((c) => {
        if (c.id === status!.chat_id) {
          if (c.typingUsersIds.includes(status!.user_id)) {
            c.typingUsersIds.splice(c.typingUsersIds.indexOf(status!.user_id));
          } else {
            c.typingUsersIds.push(status!.user_id);
          }
          isSubscribed = true;
        }
        return c;
      });
    }
    return () => {
      isSubscribed = false;
    };
  }, [webSockets.typingStatusChange]);

  useEffect(() => {
    if (
      webSockets.lastChatMessage &&
      chat?.id === webSockets.lastChatMessage.chatId
    ) {
      chatsList.forEach((chat: Chat) => {
        if (chat.id === webSockets.lastChatMessage!.chatId) {
          chat.lastMessage = webSockets.lastChatMessage;
        }
      });
      let mList: Message[] = [...messagesListForChat.reverse()];
      mList.push(webSockets.lastChatMessage);
      setMessagesListForChat(mList.reverse());
    }
  }, [webSockets.lastChatMessage]);

  const getGroupDetails = () => {
    axios
      .getRequest(`${WhatsApi.GET_GROUP_DETAILS_URL}/${chat!.groupId!}`, null)
      .then((result) => {
        setGroupDetails(Utils.groupFromJson(result));
      })
      .catch((e) => console.log(e.message));
  };

  const handleOnCallRejected = () => {};

  const handleOnCallAccepted = () => {
    navigate("/call", {
      state: {
        remoteUserId: webSockets.incomingCall!.user_id,
        remoteUserName: webSockets.incomingCall!.user_name,
        remoteUserProfileImageUrl:
          webSockets.incomingCall!.user_profile_image_url,
        callType: webSockets.incomingCall!.call_type,
        actionType: "incoming",
      },
    });
  };

  const onChatClick = (chat: Chat) => {
    setshowChatDetailsScreen(false);
    setChat(chat);
  };
  const onSearchQueryChange = (value: string) => {
    setSearchQuery(value);
  };
  const onContactClicked = (contact: User) => {
    let chat = chatsList.filter((chat: Chat) => {
      if (chat.type === ChatType.oneToOne) {
        let remoteUserId = Utils.getRemoteUserIdFromChat(
          chat,
          axios.currentUserModel!.id
        );
        return remoteUserId === contact.id;
      }
      return false;
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
  const handleShowChatInfoScreen = () => {
    setshowChatDetailsScreen(true);
  };
  const onUserSelfProfileClick = () => {
    setShowSelfProfileScreen(true);
  };
  const handleSelfTypingStatusChange = (isTyping: boolean) => {
    webSockets.sendSelfTypingStatusChange(isTyping, chat!.id);
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
        axios.updateCurrentUserModelState();
      })
      .catch((e) => console.log(e));
  };
  const updateUserAbout = (about: string) => {
    updateUserDetails(null, about)
      .then((_) => {
        axios.updateCurrentUserModelState();
      })
      .catch((e) => console.log(e));
  };
  const updateUserProfileImage = (
    imageFile: File | null,
    shouldRemoveProfileImage: boolean
  ) => {
    updateUserDetails(null, null, imageFile, shouldRemoveProfileImage)
      .then(() => {
        axios.updateCurrentUserModelState();
      })
      .catch((e: any) => console.log(e.message));
  };
  const handleSendChatMessage = (request: SendMessageRequest) => {
    webSockets?.sendChatMessage(request);
  };
  const handleCreateNewGroup = async (name: string, imageFile: File | null) => {
    try {
      let profileImageUrl: string | null = null;
      if (imageFile) {
        profileImageUrl = await axios.uploadFile(imageFile);
      }
      let createGroupResponse = await axios.postRequest(
        {
          name: name,
          profile_image_url: profileImageUrl,
          user_ids: usersToAddInGroup,
        },
        null,
        WhatsApi.CREATE_NEW_GROUP_URL
      );
      setShowCreateGroupSidebar(false);
      setUsersToAddInGroup([]);
      let chat = Utils.chatFromJson(createGroupResponse);
      let chats = [...chatsList];
      chats.push(chat);
      setChat(chat);
      setChatsList(chats);
    } catch (e: any) {
      console.log(e.message);
    }
  };
  const handleSelectUsersForGroup = () => {
    setContactNameSearchQuery("");
    setShowSelectUsersForGroup(true);
  };
  const handleAddParticipantsClicked = (participants: string[]) => {
    let request: AddRemoveParticipantsRequest = {
      group_id: groupDetails!.id,
      user_ids: participants,
    };
    axios
      .postRequest(request, null, WhatsApi.ADD_GROUP_PARTICIPANTS_URL)
      .then((_) => {
        getGroupDetails();
      })
      .catch((e: any) => console.log(e));
  };
  const handleLogOut = () => {
    auth
      .logOut()
      .then((_) => {
        axios.onUserLoggedOut();
        navigate("/auth");
      })
      .catch((e) => console.log(e));
  };

  const handleShowSelectUsersDialog = () => {
    setContactNameSearchQuery(" ");
    setShowSelectUsersForGroupDialog(true);
  };

  if (!axios.currentUserModel) {
    return null;
  }

  const handleKickUserFromGroupClicked = (groupId: string, user: User) => {
    let requestBody: RemoveParticipantsRequest = {
      group_id: groupId,
      user_ids: [user.id],
    };
    axios
      .postRequest(requestBody, null, WhatsApi.REMOVE_GROUP_PARTICIPANTS_URL)
      .then((_) => {
        if (groupDetails?.id === groupId) {
          getGroupDetails();
        }
      })
      .catch((e) => console.log(e));
  };

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
      onShowStatusScreen={() => navigate("/status")}
      onContactClicked={(contact) => onContactClicked(contact)}
      onCreateNewGroupClicked={() => handleSelectUsersForGroup()}
      onLogOutClicked={() => handleLogOut()}
      selectedChat={chat}
    />
  );

  if (showSelfProfileScreen) {
    sidebarComponent = (
      <motion.div
        style={{ height: "100%", width: "100%" }}
        key={"self_profile_screen"}
        {...componentLeftToRight}
      >
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
      </motion.div>
    );
  } else if (showSelectUsersForGroup) {
    sidebarComponent = (
      <motion.div
        style={{ height: "100%", width: "100%" }}
        key={"select_users_to_add"}
        {...componentLeftToRight}
      >
        <SelectUsersForGroup
          onUsersSelected={(userIds: string[]) => {
            setShowSelectUsersForGroup(false);
            setUsersToAddInGroup(userIds);
            setShowCreateGroupSidebar(true);
          }}
          previouslySelectedUsers={usersToAddInGroup}
          onClose={() => {
            setShowSelectUsersForGroup(false);
            setUsersToAddInGroup([]);
          }}
          onSearchQueryChange={(value: string) => searchContactsByName(value)}
          contacts={contactsList}
        />
      </motion.div>
    );
  } else if (showCreateGroupSidebar) {
    sidebarComponent = (
      <motion.div
        style={{ height: "100%", width: "100%" }}
        key={"self_profile_screen"}
        {...componentLeftToRight}
      >
        <EnterGroupDetailsScreen
          onDone={(name: string, imageFile: File | null) => {
            handleCreateNewGroup(name, imageFile);
          }}
          onClose={() => {
            setShowCreateGroupSidebar(false);
            setShowSelectUsersForGroup(true);
          }}
        />
      </motion.div>
    );
  }

  return (
    <div className="pg">
      <IncomingCallPopup
        show={
          webSockets.incomingCall != null ||
          webSockets.incomingCall != undefined
        }
        userName={
          webSockets.incomingCall ? webSockets.incomingCall.user_name : ""
        }
        userProfileImageUrl={
          webSockets.incomingCall
            ? webSockets.incomingCall.user_profile_image_url
            : null
        }
        onCallRejectedClicked={() => handleOnCallRejected()}
        onCallAcceptedClicked={() => handleOnCallAccepted()}
      />
      <LoadingBar color="#00a884" progress={progressStatus.progressPercent} />
      <SplashScreen show={showSplashScreen} />
      <SelectUsersToAddInGroupDialog
        onDoneClicked={(participants) => {
          setShowSelectUsersForGroupDialog(false);
          handleAddParticipantsClicked(participants);
        }}
        usersList={contactsList.filter((c) => {
          return !chat?.userIds?.includes(c.id);
        })}
        showDialog={showSelectUsersForGroupDialog}
        onClose={() => setShowSelectUsersForGroupDialog(false)}
      />
      <div className="sidebarContainer">
        <Suspense fallback={<DefaultFallback />}>
          {<AnimatePresence>{sidebarComponent}</AnimatePresence>}
        </Suspense>
      </div>
      <div className="sideBorder" />
      {chat ? (
        <div
          className={
            showChatDetailsScreen
              ? "chattingContainer small"
              : "chattingContainer max"
          }
        >
          <Suspense fallback={<DefaultFallback />}>
            <ChattingScreen
              onBack={() => setChat(null)}
              currentUserModel={axios.currentUserModel}
              chat={chat}
              onProfileClick={() => {
                handleShowChatInfoScreen();
              }}
              remoteUser={chat.type === ChatType.oneToOne ? remoteUser : null}
              messages={messagesListForChat}
              onSendMessage={(request: SendMessageRequest) =>
                handleSendChatMessage(request)
              }
              onTypingStatusChange={(isTyping: boolean) =>
                handleSelfTypingStatusChange(isTyping)
              }
            />
          </Suspense>
        </div>
      ) : (
        <div className="whatsappIntroContainer">
          <WhatsappIntroScreen />
        </div>
      )}
      <Suspense fallback={<DefaultFallback />}>
        <AnimatePresence>
          {showChatDetailsScreen && (
            <div className="chatInfoScreenContainer">
              <motion.div
                style={{ height: "100%" }}
                key={"self_profile_screen"}
                {...componentRightToLeft}
              >
                {chat?.type === ChatType.oneToOne ? (
                  <RemoteUserProfilePreview
                    user={remoteUser!}
                    onClose={() => setshowChatDetailsScreen(false)}
                  />
                ) : (
                  <GroupDetailsScreen
                    currentUser={axios.currentUserModel!!}
                    group={groupDetails}
                    onAddParticipantsClicked={handleShowSelectUsersDialog}
                    onClose={() => setshowChatDetailsScreen(false)}
                    onKickUserClicked={(groupId: string, user: User) =>
                      handleKickUserFromGroupClicked(groupId, user)
                    }
                  />
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </Suspense>
    </div>
  );
};

export default MainScreen;
