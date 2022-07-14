import { useState } from "react";
import "../css/mainSidebar.css";
import SidebarHeader from "./SidebarHeader";
import SidebarSearchBar from "./SidebarSearchBar";
import ContactItem from './ContactItem';
import ChatItem from './ChatItem';

const MainSidebar = ({
  chatsList,
  onChatClicked,
  onProfileClick,
  onSearchQueryChange,
  contactsList,
  onContactClicked,
  currentUserModel,
}) => {
  const [isSearchingForUser, setIsSearchingForUser] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);

  if (!currentUserModel) {
    return null;
  }

  function handleSearchQueryChange(value) {
    if (value.length === 0) {
      setIsSearchingForUser(false);
    } else {
      setIsSearchingForUser(true);
    }
    onSearchQueryChange(value);
  }

  function handleChatClicked(chat) {
    setSelectedChat(chat);
    onChatClicked(chat);
  }

  function handleContactClicked(contact) {
    setIsSearchingForUser(false);
    onContactClicked(contact);
  }

  return (
    <div id="ctnt">
      <SidebarHeader
        profileImageUrl={currentUserModel.getProfileImageUrl()}
        onProfileClick={() => onProfileClick()}
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
                isSelected={selectedChat ? selectedChat.id === chat.id: false}
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
