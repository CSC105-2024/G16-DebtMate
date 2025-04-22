import React, { useState, useEffect } from "react";
import HamburgerMenu from "../Component/HamburgerMenu";
import { Menu } from "lucide-react";
import FriendCard from "../Component/FriendCard";
import defaultprofile from "/assets/icons/defaultprofile.png";
import SearchBar from "../Component/SearchBar";

function AddFriends() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const menuWidth = "w-72";

  // Function to search for users
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:3000/api/search/users?q=${encodeURIComponent(
          searchTerm
        )}&limit=5`,
        {
          credentials: "include", // Send cookies for auth
        }
      );

      const data = await response.json();

      if (data.success) {
        const transformedResults = data.users.map((user) => ({
          id: user.id,
          name: user.username,
          balance: 0,
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

  // Debounce search as user types
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim()) {
        handleSearch();
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

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
                <FriendCard
                  key={user.id}
                  name={user.name}
                  balance={user.balance}
                  avatarUrl={user.avatarUrl}
                  onClick={() => console.log("Add friend:", user.name)}
                  showAddButton={true}
                />
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
