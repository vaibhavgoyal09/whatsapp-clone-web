import React from "react";
import "../css/mainSidebar.css";
import ChatItem from "./ChatItem";
import SidebarHeader from "./SidebarHeader";
import SidebarSearchBar from "./SidebarSearchBar";

const MainSidebar = ({ chats }) => {
  // if (chats === null || chats === undefined) {
  //   return null;
  // }
  console.log(chats);

  return (
    <div className="container">
      <SidebarHeader />
      <SidebarSearchBar />
      <div className="chats">
        {chats.map((chat, index) => (
          <>
            <div className="dividerLine" />
            <ChatItem key={index} chat={chat} />
          </>
        ))}
      </div>
    </div>
  );
};

export default MainSidebar;
