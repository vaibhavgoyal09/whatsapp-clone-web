import React, { useState } from "react";
import "../css/mainSidebar.css";
import Chat from "../models/Chat";
import User from "../models/User";
import ChatItem from "./ChatItem";
import ContactItem from "./ContactItem";
import SidebarHeader from "./SidebarHeader";
import SidebarSearchBar from "./SidebarSearchBar";

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
  selectedChat: Chat | null;
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
  selectedChat
}) => {
  const [isSearchingForUser, setIsSearchingForUser] = useState<boolean>(false);

  function handleSearchQueryChange(value: string) {
    if (value.length === 0) {
      setIsSearchingForUser(false);
    } else {
      setIsSearchingForUser(true);
    }
    onSearchQueryChange(value);
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
                key={contact.id}
                contact={contact}
                onClick={() => handleContactClicked(contactsList[index])}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="chatsContainer">
          {chatsList.map((chat, index) => (
            <ChatItem
              key={chat.id}
              chat={chat}
              isSelected={selectedChat ? selectedChat.id === chat.id : false}
              onChatClick={() => onChatClicked(chatsList[index])}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MainSidebar;
