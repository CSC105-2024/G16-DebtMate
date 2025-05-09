import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import HamburgerMenu from "../Component/HamburgerMenu";
import { Menu } from "lucide-react";
import FriendCard from "../Component/FriendCard";
import defaultprofile from "/assets/icons/defaultprofile.png";
import SearchBar from "../Component/SearchBar";
import FriendProfileModal from "../Component/FriendProfileModal";
import { searchUsers, filterBySearchTerm } from "../utils/searchUtils";

function FriendList() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortAsc, setSortAsc] = useState(true);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [friends, setFriends] = useState([]);
  const [error, setError] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const friendsPerPage = 14;

  // Fetch friends from the database
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const meResponse = await axios.get(
          "http://localhost:3000/api/users/me",
          {
            withCredentials: true,
          }
        );
        const meData = meResponse.data;

        if (!meData.success) {
          throw new Error(meData.message || "Failed to fetch user data");
        }

        const friendsResponse = await axios.get(
          `http://localhost:3000/api/users/${meData.user.id}/friends`,
          {
            withCredentials: true,
          }
        );

        const friendsData = friendsResponse.data;

        if (friendsData.success) {
          const formattedFriends = friendsData.friends.map((friend) => ({
            id: friend.id,
            name: friend.name || friend.username,
            username: friend.username,
            email: friend.email,
            balance: 0,
            avatarUrl: friend.avatarUrl || defaultprofile,
            bio: friend.bio || "No bio available",
          }));

          setFriends(formattedFriends);
        } else {
          throw new Error(friendsData.message || "Failed to fetch friends");
        }
      } catch (err) {
        console.error("Error fetching friends:", err);
        setError("Failed to load friends. Please try again later.");
      }
    };

    fetchFriends();
  }, []);

  const handleFriendCardClick = (friend) => {
    setSelectedFriend(friend);
  };

  const handleClosePopup = () => {
    setSelectedFriend(null);
  };

  // Updated search handler to use searchUtils
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setSearchResults(null);
      return;
    }

    // First try to filter existing friends
    const filteredLocalFriends = filterBySearchTerm(friends, searchTerm, [
      "name",
      "username",
    ]);

    // If we have local results, just use those
    if (filteredLocalFriends.length > 0) {
      setSearchResults(filteredLocalFriends);
      return;
    }

    // Otherwise, search the API
    const result = await searchUsers(searchTerm);

    if (result.success) {
      setSearchResults(result.results);
    } else {
      console.error("Search failed:", result.error);
      // Fall back to local filtering even if API search fails
      setSearchResults(filteredLocalFriends);
    }
  };

  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults(null);
    }
  }, [searchTerm]);

  const menuWidth = "w-72";

  useEffect(() => {
    const checkScreenSize = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      setIsMenuOpen(desktop); // Auto-open on desktop
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const filteredFriends =
    searchResults ||
    (searchTerm
      ? filterBySearchTerm(friends, searchTerm, ["name", "username"])
      : friends);

  const sortedFriends = [...filteredFriends].sort((a, b) => {
    return sortAsc
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name);
  });

  // Pagination for desktop
  const totalPages = Math.ceil(sortedFriends.length / friendsPerPage);
  const paginatedFriends = sortedFriends.slice(
    (currentPage - 1) * friendsPerPage,
    currentPage * friendsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchResults]);

  const modalRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleClosePopup();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex bg-color-dreamy h-screen overflow-hidden">
      {/* Sidebar */}
      {isDesktop ? (
        <div className={`fixed inset-y-0 left-0 z-50 ${menuWidth}`}>
          <HamburgerMenu isOpen={true} setIsOpen={setIsMenuOpen} />
        </div>
      ) : (
        <div
          className={`fixed inset-y-0 left-0 z-50 ${menuWidth} transform transition-transform duration-300 ease-in-out ${
            isMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <HamburgerMenu isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />
        </div>
      )}

      {/* Main Content */}
      <div className={`flex-1 flex flex-col ${isDesktop ? "ml-72" : ""}`}>
        {/* Top Sticky Header  */}
        <div className="sticky top-0 z-30 bg-color-dreamy px-4 pb-1">
          <div className="flex items-center justify-center gap-3">
            {!isDesktop && (
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-3 border border-twilight rounded-md"
              >
                <Menu className="w-5 h-5 text-black" />
              </button>
            )}
            <div className="flex-grow max-w-md relative ">
              <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                onSearch={handleSearch}
                placeholder="Search friends..."
              />
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <h1 className="text-2xl font-hornbill text-twilight">Friends</h1>

            <button
              onClick={() => setSortAsc(!sortAsc)}
              className="p-2 hover:bg-slate-200 rounded transition"
            >
              <img
                src={
                  sortAsc
                    ? "/assets/icons/12-order.svg"
                    : "/assets/icons/az-order.svg"
                }
                alt="Sort toggle"
                className="w-5 h-5"
              />
            </button>
          </div>
        </div>

        {error ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-red-500">{error}</p>
          </div>
        ) : sortedFriends.length === 0 ? (
          <div className="flex-1 flex items-center justify-center flex-col">
            <p className="text-twilight mb-2">
              {searchTerm
                ? "No search results found."
                : "You don't have any friends yet."}
            </p>
            {!searchTerm && (
              <button
                onClick={() => (window.location.href = "/add-friends")}
                className="px-4 py-2 bg-twilight text-white rounded-[13px]"
              >
                Add Friends
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Scrollable List (Mobile/Tablet) */}
            <div className="flex-1 overflow-y-auto px-4 pt-4 pb-10 lg:hidden">
              <div className="w-full max-w-md mx-auto space-y-4">
                {sortedFriends.map((friend) => (
                  <FriendCard
                    key={friend.id}
                    name={friend.name}
                    balance={friend.balance}
                    avatarUrl={friend.avatarUrl}
                    friend={friend}
                    onClick={() => handleFriendCardClick(friend)}
                  />
                ))}
              </div>
            </div>

            {/* Paginated List (Desktop only) */}
            <div className="hidden lg:flex flex-col flex-1 overflow-hidden px-4 pt-6">
              <div className="flex-1 overflow-y-auto w-full max-w-4xl mx-auto columns-2 gap-4 pr-2">
                {paginatedFriends.map((friend) => (
                  <div key={friend.id} className="mb-4 break-inside-avoid">
                    <FriendCard
                      name={friend.name}
                      balance={friend.balance}
                      avatarUrl={friend.avatarUrl}
                      friend={friend}
                      onClick={() => handleFriendCardClick(friend)}
                    />
                  </div>
                ))}
              </div>

              {/* Pagination controls */}
              <div className="py-[3rem] w-full max-w-4xl mx-auto flex justify-center gap-2 border-t mt-auto">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="px-3 py-1 bg-twilight text-white rounded-[13px] disabled:opacity-50"
                >
                  Prev
                </button>
                <span className="px-4 py-1 text-twilight font-semibold">
                  Page {currentPage} of {Math.max(totalPages, 1)}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="px-3 py-1 bg-twilight text-white rounded-[13px] disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Overlay (Mobile only) */}
      {!isDesktop && isMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {selectedFriend && (
        <div ref={modalRef}>
          <FriendProfileModal
            friend={selectedFriend}
            onClose={handleClosePopup}
          />
        </div>
      )}
    </div>
  );
}

export default FriendList;
