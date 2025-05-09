/**
 * friend search and adding page component.
 * allows users to search for other users to add as friends.
 * includes debounced search, loading states, and friend request functionality(not working).
 * uses the user search API endpoint from the backend.
 */

import React, { useState, useEffect } from "react";
import HamburgerMenu from "../Component/HamburgerMenu";
import { Menu, UserPlus } from "lucide-react";
import FriendCard from "../Component/FriendCard";
import defaultprofile from "/assets/icons/defaultprofile.png";
import SearchBar from "../Component/SearchBar";
import useResponsiveLayout from "../hooks/useResponsiveLayout";

function AddFriends() {
  const { isDesktop, isMenuOpen, setIsMenuOpen } = useResponsiveLayout();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [addingFriend, setAddingFriend] = useState(null);

  const menuWidth = "w-72";

  /**
   * Searches for users by username using the backend API
   * Called when user submits search or through debounced effect
   */
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Query the backend search API, sending auth cookies
      const response = await fetch(
        `http://localhost:3000/api/search/users?q=${encodeURIComponent(
          searchTerm
        )}&limit=5`,
        {
          credentials: "include", // Send auth token cookie
        }
      );

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        // Transform API results to component-friendly format
        const transformedResults = data.users.map((user) => ({
          id: user.id,
          name: user.username || user.name, // Handle both field names
          balance: 0, // New users start with 0 balance
          avatarUrl: defaultprofile,
        }));

        setSearchResults(transformedResults);
      } else {
        setError(data.error || "Failed to search for users");
        setSearchResults([]);
      }
    } catch (err) {
      console.error("Error searching for users:", err);
      setError("Failed to connect to the server");
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Sends friend request to the selected user
   * Updates UI to reflect pending state during request
   * @param {number} userId - The ID of the user to add as friend
   */
  const handleAddFriend = async (userId) => {
    setAddingFriend(userId);

    try {
      // Send friend request to the backend API
      const response = await fetch(
        "http://localhost:3000/api/friends/request",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ friendId: userId }),
          credentials: "include",
        }
      );

      const data = await response.json();

      if (data.success) {
        // Remove the user from search results after successfully adding
        setSearchResults((prev) => prev.filter((user) => user.id !== userId));
      } else {
        throw new Error(data.message || "Failed to add friend");
      }
    } catch (err) {
      console.error("Error adding friend:", err);
      setError(err.message || "Failed to add friend");
    } finally {
      setAddingFriend(null);
    }
  };

  // Debounce search input to prevent excessive API calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim()) {
        handleSearch();
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Handle responsive layout based on screen size
// fixed with custom hook

  return (
    <div className="flex h-screen bg-color-dreamy">
      {/* Hamburger Menu */}
      <div
        className={`fixed inset-y-0 left-0 z-50 ${menuWidth} transform transition-transform duration-300 ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <HamburgerMenu isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-72">
        {/* Top Bar */}
        <div className="flex items-center p-4 gap-3">
          {/* Menu button - only visible on mobile */}
          {!isDesktop && (
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-twilight"
            >
              <Menu size={24} />
            </button>
          )}

          {/* Search Bar */}
          <div className="flex-grow max-w-md mx-auto">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              onSearch={handleSearch}
              placeholder="Search for users..."
            />
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="max-w-md mx-auto">
            <p className="text-4xl font-hornbill font-black text-twilight mb-6 text-left">
              Add Friends
            </p>

            {/* Loading, Error, and No Results States */}
            {isLoading && (
              <div className="text-center py-4">
                <p className="text-twilight">Searching...</p>
              </div>
            )}

            {error && (
              <div className="text-center py-4">
                <p className="text-red-500">{error}</p>
              </div>
            )}

            {!isLoading &&
              searchTerm &&
              searchResults.length === 0 &&
              !error && (
                <div className="text-center py-4">
                  <p className="text-twilight">No users found</p>
                </div>
              )}

            {/* Search Results */}
            <div className="space-y-4">
              {searchResults.map((user) => (
                <div key={user.id} className="relative">
                  <FriendCard
                    name={user.name}
                    balance={user.balance}
                    avatarUrl={user.avatarUrl}
                    onClick={() => console.log("View profile:", user.name)}
                  />
                  <button
                    onClick={() => handleAddFriend(user.id)}
                    disabled={addingFriend === user.id}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-twilight text-white p-2 rounded-full hover:bg-opacity-80 disabled:opacity-50"
                  >
                    <UserPlus size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Overlay to close menu when clicking outside - mobile only */}
      {!isDesktop && isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </div>
  );
}

export default AddFriends;
