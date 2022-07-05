import React from "react";
import "../css/sidebarSearchBar.css";

const SidebarSearchBar = () => {
  return (
    <div className="searchBox">
      <span>
        <i class="fa-solid fa-magnifying-glass"></i>
      </span>
      <input
        class="searchInput"
        type="text"
        placeholder="Enter User Name"
        name="username"
        autoComplete="off"
      />
    </div>
  );
};

export default SidebarSearchBar;
