import { useState } from "react";
import "../css/mainSidebar.css";
import ChatsList from "./ChatsList";
import SidebarHeader from "./SidebarHeader";
import SidebarSearchBar from "./SidebarSearchBar";
import ContactsList from "./ContactsList";

const MainSidebar = ({
  chatsList,
  onChatClicked,
  onProfileClick,
  onSearchQueryChange,
  contactsList,
  onContactClicked,
  currentUserModel
}) => {
  const [isSearchingForUser, setIsSearchingForUser] = useState(false);

  if(!currentUserModel) {
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

  function handleContactClicked(contact) {
    setIsSearchingForUser(false);
    onContactClicked(contact);
  }

  return (
    <div id="ctnt">
      <SidebarHeader profileImageUrl={currentUserModel.getProfileImageUrl()} onProfileClick={() => onProfileClick()} />
      <SidebarSearchBar
        onSearchQueryChange={(value) => {
          handleSearchQueryChange(value);
        }}
      />
      <div className="dividerLine" />
      {isSearchingForUser ? (
        <div className="contactsContainer">
          <ContactsList contacts={contactsList} onContactClicked={(contact) => {handleContactClicked(contact)}} />
        </div>
      ) : (
        <div className="chatsContainer">
          <ChatsList
            chats={chatsList}
            onChatClicked={(chat) => onChatClicked(chat)}
          />
        </div>
      )}
    </div>
  );
};

export default MainSidebar;
