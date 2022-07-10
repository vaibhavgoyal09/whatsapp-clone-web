import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import "../css/sidebarSearchBar.css";

const SidebarSearchBar = ({ onSearchQueryChange }) => {
  const [isInputFieldEmpty, setIsInputFieldEmpty] = useState(true);
  const [searchFieldValue, setSearchFieldValue] = useState("");

  function onClearSearchFieldClicked() {
    setSearchFieldValue("");
    setIsInputFieldEmpty(true);
  }

  const handleSearchValueChange = (event) => {
    setSearchFieldValue(event.target.value);
    console.log("Handle Value Change Called");
  };

  useEffect(() => {
    onSearchQueryChange(searchFieldValue);
    if (searchFieldValue.length === 0) {
      setIsInputFieldEmpty(true);
    } else {
      setIsInputFieldEmpty(false);
    }
  }, [searchFieldValue]);

  return (
    <div className="searchBox">
      {isInputFieldEmpty ? (
        <span>
          <i className="fa-solid fa-magnifying-glass"></i>
        </span>
      ) : (
        <span>
          <i
            className="fa-solid fa-arrow-left"
            onClick={onClearSearchFieldClicked}
          ></i>
        </span>
      )}
      <input
        className="searchInput"
        type="text"
        value={searchFieldValue}
        onChange={handleSearchValueChange}
        placeholder="Search or start a new chat"
        name="username"
        autoComplete="off"
        spellCheck={false}
      />
    </div>
  );
};

export default SidebarSearchBar;