import React, { useState, useEffect } from "react";
import HamburgerMenu from "../Component/HamburgerMenu";
import { Menu } from "lucide-react";
import FriendCard from "../Component/FriendCard";
import defaultprofile from "/assets/icons/defaultprofile.png";
import SearchBar from "../Component/SearchBar";

function FriendList() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const friendsPerPage = 5;

  // Sample friend data
  const friends = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    name: `Friend ${i + 1}`,
    balance: Math.floor(Math.random() * 200 - 100),
    avatarUrl: defaultprofile,
  }));

  const handleSearch = () => {
    console.log("Searching for:", searchTerm);
  };

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

  // Pagination logic (for desktop)
  const totalPages = Math.ceil(friends.length / friendsPerPage);
  const paginatedFriends = friends.slice(
    (currentPage - 1) * friendsPerPage,
    currentPage * friendsPerPage
  );

  const menuWidth = "w-72";

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
        {/* Top Sticky Header */}
        <div className="sticky top-0 z-30 bg-color-dreamy px-4 pt-4 pb-2">
          <div className="flex items-center justify-center gap-3">
            {!isDesktop && (
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-3 border border-twilight rounded-md"
              >
                <Menu className="w-5 h-5 text-black" />
              </button>
            )}
            <div className="flex-grow max-w-md">
              <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                onSearch={handleSearch}
                placeholder="Search friends..."
              />
            </div>
          </div>
          <h1 className="text-2xl font-hornbill text-twilight mt-4 text-center">
            Friend List
          </h1>
        </div>

        {/* Scrollable List (Mobile/Tablet) */}
        <div className="flex-1 overflow-y-auto px-4 pt-4 pb-10 lg:hidden">
          <div className="w-full max-w-md mx-auto space-y-4">
            {friends.map((friend) => (
              <FriendCard
                key={friend.id}
                name={friend.name}
                balance={friend.balance}
                avatarUrl={friend.avatarUrl}
                onClick={() => console.log("View profile:", friend.name)}
              />
            ))}
          </div>
        </div>

        {/* Paginated List (Desktop only) */}
        <div className="hidden lg:flex flex-col items-center flex-1 overflow-hidden px-4 pt-6">
          <div className="w-full max-w-md space-y-4">
            {paginatedFriends.map((friend) => (
              <FriendCard
                key={friend.id}
                name={friend.name}
                balance={friend.balance}
                avatarUrl={friend.avatarUrl}
                onClick={() => console.log("View profile:", friend.name)}
              />
            ))}
          </div>

          {/* Pagination controls */}
          <div className="flex gap-2 mt-6">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-twilight text-white rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span className="px-4 py-1 text-twilight font-semibold">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-twilight text-white rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Overlay (Mobile only) */}
      {!isDesktop && isMenuOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)} />
      )}
    </div>
  );
}

export default FriendList;
