/**
 * friend search and adding page component.
 * allows users to search for other users to add as friends.
 * includes debounced search, loading states, and friend request functionality.
 * uses the user search API endpoint from the backend.
 */

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import HamburgerMenu from "../Component/HamburgerMenu";
import { Menu, UserPlus } from "lucide-react";
import FriendCard from "../Component/FriendCard";
import defaultprofile from "/assets/icons/defaultprofile.png";
import SearchBar from "../Component/SearchBar";
import FriendProfileModal from "../Component/FriendProfileModal";

function AddFriends() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);
  const [addingFriend, setAddingFriend] = useState(null);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const modalRef = useRef();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/me", {
          credentials: "include",
        });

        const data = await response.json();

        if (data.success) {
          setCurrentUser({ id: data.userId });
        } else {
          console.error("Failed to fetch current user");
        }
      } catch (err) {
        console.error("Error fetching current user");
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const checkScreenSize = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      setIsMenuOpen(desktop);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Add this effect to trigger search when searchTerm changes
  useEffect(() => {
    // We dont need this if function but i am too scared to remove it
    if (searchTerm.length > 0) {
      handleSearch();
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  // Effect for outside click detection
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setSelectedFriend(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = async () => {
    setError(null);

    try {
      if (!currentUser) {
        try {
          const userResponse = await fetch("http://localhost:3000/api/me", {
            credentials: "include",
          });

          const userData = await userResponse.json();

          if (userData.success) {
            setCurrentUser({ id: userData.userId });
          } else {
            setError("Failed to fetch user info. Please try again.");
            return;
          }
        } catch (err) {
          setError("Network error. Please try again.");
          return;
        }
      }

      // Update to use the correct backend endpoint
      const response = await fetch(
        `http://localhost:3000/api/users/friends/search?query=${encodeURIComponent(
          searchTerm
        )}`,
        {
          credentials: "include",
        }
      );

      const data = await response.json();

      if (data.success) {
        const currentUserId = currentUser ? currentUser.id : null;
        const filteredUsers = currentUserId
          ? data.users.filter(
              (user) => String(user.id) !== String(currentUserId)
            )
          : data.users;

        // Format the results for display
        const formattedResults = filteredUsers.map((user) => ({
          id: user.id,
          name: user.name || user.username,
          username: user.username,
          email: user.email,
          balance: 0,
          avatarUrl: defaultprofile,
          bio: user.bio || "",
        }));

        setSearchResults(formattedResults);
      } else {
        setError(data.message || "Search failed");
        setSearchResults([]);
      }
    } catch (err) {
      setError("Network error while searching");
      setSearchResults([]);
    }
  };

  // Handle adding a friend
  const handleAddFriend = async (friend) => {
    setAddingFriend(friend.id);

    try {
      // Use friendUsername instead of friendId
      const response = await fetch("http://localhost:3000/api/users/friends", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ friendUsername: friend.username }),
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        // Remove the added friend from results
        setSearchResults((prevResults) =>
          prevResults.filter((user) => user.id !== friend.id)
        );
      } else {
        console.error("Failed to add friend");
      }
    } catch (err) {
      console.error("Add friend error");
    } finally {
      setAddingFriend(null);
    }
  };

  // Handle removing a friend from search results after being added
  const handleFriendAdded = (friendId) => {
    // Remove the added friend from results
    setSearchResults((prevResults) =>
      prevResults.filter((user) => user.id !== friendId)
    );
  };

  // Handle friend card click
  const handleFriendCardClick = (friend) => {
    setSelectedFriend(friend);
  };

  // Handle closing the modal
  const handleClosePopup = () => {
    setSelectedFriend(null);
  };

  return (
    <div className="flex h-screen bg-color-dreamy">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <HamburgerMenu isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col lg:ml-72">
        <div className="flex items-center p-4 gap-3">
          {!isDesktop && (
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-twilight"
            >
              <Menu size={24} />
            </button>
          )}

          <div className="flex-grow max-w-md mx-auto">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search for users..."
            />
          </div>
        </div>

        <div className="flex-1 p-4 overflow-y-auto">
          <h1 className="text-2xl font-hornbill text-twilight mb-4">
            Add Friends
          </h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {searchResults.map((user) => (
                <div key={user.id} className="relative">
                  <FriendCard
                    name={user.name}
                    balance={user.balance}
                    avatarUrl={user.avatarUrl}
                    friend={user}
                    onClick={() => handleFriendCardClick(user)}
                  />
                  <button
                    onClick={() => handleAddFriend(user)}
                    disabled={addingFriend === user.id}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-twilight text-white p-2 rounded-full hover:bg-opacity-80 disabled:opacity-50"
                  >
                    <UserPlus size={18} />
                  </button>
                </div>
              ))}
            </div>
          ) : searchTerm.length > 0 ? (
            <div className="flex justify-center items-center h-40">
              <p className="text-twilight">No users found</p>
            </div>
          ) : (
            <div className="flex justify-center items-center h-40">
              <p className="text-twilight">
                Search for users to add as friends
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Overlay to close menu when clicking outside - mobile only */}
      {!isDesktop && isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Add FriendProfileModal */}
      {selectedFriend && (
        <div ref={modalRef}>
          <FriendProfileModal
            friend={selectedFriend}
            onClose={handleClosePopup}
            onFriendAdded={handleFriendAdded}
          />
        </div>
      )}
    </div>
  );
}

export default AddFriends;
