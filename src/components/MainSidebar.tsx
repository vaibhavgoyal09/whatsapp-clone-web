import React, { useState } from "react";
import "../css/mainSidebar.css";
import SidebarHeader from "./SidebarHeader";
import SidebarSearchBar from "./SidebarSearchBar";
import ContactItem from "./ContactItem";
import ChatItem from "./ChatItem";
import Chat from "../models/Chat";
import User from "../models/User";

interface Props {
  chatsList: Chat[];
  onProfileClick: () => void;
  onSearchQueryChange: (value: string) => void;
  contactsList: User[];
  onContactClicked: (contact: User) => void;
  onChatClicked: (chat: Chat) => void;
  currentUserModel: User;
  onShowStatusScreen: () => void;
  onCreateNewGroupClicked: () => void;
  onLogOutClicked: () => void;
}

const MainSidebar: React.FC<Props> = ({
  chatsList,
  onChatClicked,
  onProfileClick,
  onSearchQueryChange,
  contactsList,
  onContactClicked,
  currentUserModel,
  onShowStatusScreen,
  onCreateNewGroupClicked,
  onLogOutClicked,
}) => {
  const [isSearchingForUser, setIsSearchingForUser] = useState<boolean>(false);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

  function handleSearchQueryChange(value: string) {
    if (value.length === 0) {
      setIsSearchingForUser(false);
    } else {
      setIsSearchingForUser(true);
    }
    onSearchQueryChange(value);
  }

  function handleChatClicked(chat: Chat) {
    setSelectedChat(chat);
    onChatClicked(chat);
  }

  function handleContactClicked(contact: User) {
    setIsSearchingForUser(false);
    onContactClicked(contact);
  }

  return (
    <div id="ctnt">
      <SidebarHeader
        profileImageUrl={currentUserModel.profileImageUrl}
        onProfileClick={() => onProfileClick()}
        onShowStatusScreen={() => onShowStatusScreen()}
        onLogOutClicked={() => onLogOutClicked()}
        onCreateNewGroupClicked={() => onCreateNewGroupClicked()}
      />
      <SidebarSearchBar
        onSearchQueryChange={(value) => {
          handleSearchQueryChange(value);
        }}
      />
      <div className="dividerLine" />
      {isSearchingForUser ? (
        <div className="contactsContainer">
          <div className="contacts">
            {contactsList.map((contact, index) => (
              <ContactItem
                key={index}
                contact={contact}
                onClick={() => handleContactClicked(contactsList[index])}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="chatsContainer">
          <div className="chats">
            {chatsList.map((chat, index) => (
              <ChatItem
                key={index}
                chat={chat}
                isSelected={selectedChat ? selectedChat.id === chat.id : false}
                onChatClick={() => handleChatClicked(chatsList[index])}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MainSidebar;
