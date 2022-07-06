import "../css/mainSidebar.css";
import ChatsList from "./ChatsList";
import SidebarHeader from "./SidebarHeader";
import SidebarSearchBar from "./SidebarSearchBar";

const MainSidebar = ({ chats, onChatClicked, onProfileClick }) => {
  return (
    <div id="ctnt">
      <SidebarHeader onProfileClick={() => onProfileClick()}/>
      <SidebarSearchBar />
      <div className="dividerLine"/>
      <div className="chatsContainer">
        <ChatsList chats={chats} onChatClicked={(chat) => onChatClicked(chat)}/>
      </div>
    </div>
  );
};

export default MainSidebar;
