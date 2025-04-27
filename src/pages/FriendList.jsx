import React, { useState, useEffect, useRef } from "react";
import HamburgerMenu from "../Component/HamburgerMenu";
import { Menu } from "lucide-react";
import FriendCard from "../Component/FriendCard";
import defaultprofile from "/assets/icons/defaultprofile.png";
import SearchBar from "../Component/SearchBar";
import FriendProfileModal from "../Component/FriendProfileModal";

function FriendList() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortAsc, setSortAsc] = useState(true);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const friendsPerPage = 14;

  // Mock data - adding username, email, and bio
  const friends = [
    { id: 1, name: "Alan", balance: 100, avatarUrl: defaultprofile, username: "alan123", email: "alan123@example.com", bio: "Lover of music and art." },
    { id: 2, name: "Beauz", balance: -100, avatarUrl: defaultprofile, username: "beauz456", email: "beauz456@example.com", bio: "Adventure enthusiast and coffee addict." },
    { id: 4, name: "Colde", balance: 0, avatarUrl: defaultprofile, username: "colde789", email: "colde789@example.com", bio: "Just here to learn and grow." },
    { id: 5, name: "Colde", balance: 0, avatarUrl: defaultprofile, username: "colde123", email: "colde123@example.com", bio: "Tech lover and gamer." },
    { id: 6, name: "Colde", balance: 0, avatarUrl: defaultprofile, username: "colde456", email: "colde456@example.com", bio: "Exploring the world, one step at a time." },
    { id: 7, name: "Colde", balance: 0, avatarUrl: defaultprofile, username: "colde789", email: "colde789@example.com", bio: "Just living life." },
    { id: 8, name: "Colde", balance: 0, avatarUrl: defaultprofile, username: "colde012", email: "colde012@example.com", bio: "Software developer and coffee lover." },
    { id: 9, name: "Colde", balance: 0, avatarUrl: defaultprofile, username: "colde345", email: "colde345@example.com", bio: "Passionate about learning new things." },
    { id: 10, name: "Colde", balance: 0, avatarUrl: defaultprofile, username: "colde678", email: "colde678@example.com", bio: "Building things and breaking them apart." },
    { id: 11, name: "Colde", balance: 0, avatarUrl: defaultprofile, username: "colde901", email: "colde901@example.com", bio: "Music lover, always exploring new genres." },
    { id: 12, name: "Colde", balance: 0, avatarUrl: defaultprofile, username: "colde234", email: "colde234@example.com", bio: "Life’s too short for bad coffee." },
    { id: 13, name: "Colde", balance: 0, avatarUrl: defaultprofile, username: "colde567", email: "colde567@example.com", bio: "Taking one day at a time." },
    { id: 14, name: "Colde", balance: 0, avatarUrl: defaultprofile, username: "colde890", email: "colde890@example.com", bio: "Making tech more human." },
    { id: 15, name: "Colde", balance: 0, avatarUrl: defaultprofile, username: "colde012", email: "colde012@example.com", bio: "Adventurer at heart." },
    { id: 16, name: "Colde", balance: 0, avatarUrl: defaultprofile, username: "colde345", email: "colde345@example.com", bio: "Love nature and the outdoors." },
    { id: 17, name: "Colde", balance: 0, avatarUrl: defaultprofile, username: "colde678", email: "colde678@example.com", bio: "Driven by curiosity." },
    { id: 18, name: "Colde", balance: 0, avatarUrl: defaultprofile, username: "colde901", email: "colde901@example.com", bio: "Gamer and full-time dreamer." },
    { id: 19, name: "Colde", balance: 0, avatarUrl: defaultprofile, username: "colde234", email: "colde234@example.com", bio: "Creative and artistic soul." },
    { id: 20, name: "Colde", balance: 0, avatarUrl: defaultprofile, username: "colde567", email: "colde567@example.com", bio: "I enjoy a good challenge." },
    { id: 21, name: "Colde", balance: 0, avatarUrl: defaultprofile, username: "colde890", email: "colde890@example.com", bio: "Tech enthusiast and maker." },
    { id: 22, name: "Colde", balance: 0, avatarUrl: defaultprofile, username: "colde123", email: "colde123@example.com", bio: "Learning new skills every day." },
    { id: 23, name: "Colde", balance: 0, avatarUrl: defaultprofile, username: "colde456", email: "colde456@example.com", bio: "Coding is my passion." }
  ];
  

  const handleFriendCardClick = (friend) => {
    setSelectedFriend(friend);
  };

  const handleClosePopup = () => {
    setSelectedFriend(null);
  };

  const handleSearch = () => {
    console.log("Searching for:", searchTerm);
  };

  // Menu width consistent between mobile and desktop
  const menuWidth = "w-72"; // Tailwind class for width

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

  // Pagination for desktop
  const totalPages = Math.ceil(friends.length / friendsPerPage);
  const paginatedFriends = friends.slice(
    (currentPage - 1) * friendsPerPage,
    currentPage * friendsPerPage
  );

  // Ref for detecting click outside the modal
  const modalRef = useRef();

  useEffect(() => {
    // Function to close modal when clicking outside
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
          <div className="mt-4 flex items-center justify-between">
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

        {/* Scrollable List (Mobile/Tablet) */}
        <div className="flex-1 overflow-y-auto px-4 pt-4 pb-10 lg:hidden">
          <div className="w-full max-w-md mx-auto space-y-4">
            {friends.map((friend) => (
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
                  key={friend.id}
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
          <div className="py-4 w-full max-w-4xl mx-auto flex justify-center gap-2 border-t mt-auto">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-twilight text-white rounded-[13px] disabled:opacity-50"
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
              className="px-3 py-1 bg-twilight text-white rounded-[13px] disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
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
