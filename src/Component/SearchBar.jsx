/**
 * reusable search bar component used across the application.
 * provides search input with customizable placeholder text.
 * includes a search button with icon from lucide-react.
 * used in multiple pages including AddFriends and FriendList.
 */

import React from "react";
import { Search } from "lucide-react";

function SearchBar({
  value,
  onChange,
  onSearch,
  placeholder = "Enter Username",
}) {
  return (
    <div className="flex items-center flex-grow rounded-[13px] border border-twilight px-4 py-2 bg-transparent">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-grow outline-none bg-transparent text-twilight placeholder-twilight"
      />
      <button onClick={onSearch} aria-label="Search">
        <Search className="w-5 h-5 text-twilight hover:scale-105 transition-transform" />
      </button>
    </div>
  );
}

export default SearchBar;
