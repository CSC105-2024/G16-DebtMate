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
  const [sortAsc, setSortAsc] = useState(true);
  const friendsPerPage = 14;

  // Mock data
  const friends = [
    {id: 1, name: "Alan", balance: 100, avatarUrl: defaultprofile,},
    {id: 2, name: "Beauz", balance: -100, avatarUrl: defaultprofile,},
    {id: 4, name: "Colde", balance: 0,avatarUrl: defaultprofile,},
    {id: 5, name: "Colde", balance: 0,avatarUrl: defaultprofile,},
    {id: 6, name: "Colde", balance: 0,avatarUrl: defaultprofile,},
    {id: 7, name: "Colde", balance: 0,avatarUrl: defaultprofile,},
    {id: 8, name: "Colde", balance: 0,avatarUrl: defaultprofile,},
    {id: 9, name: "Colde", balance: 0,avatarUrl: defaultprofile,},
    {id: 10, name: "Colde", balance: 0,avatarUrl: defaultprofile,},
    {id: 11, name: "Colde", balance: 0,avatarUrl: defaultprofile,},
    {id: 12, name: "Colde", balance: 0,avatarUrl: defaultprofile,},
    {id: 13, name: "Colde", balance: 0,avatarUrl: defaultprofile,},
    {id: 14, name: "Colde", balance: 0,avatarUrl: defaultprofile,},
    {id: 15, name: "Colde", balance: 0,avatarUrl: defaultprofile,},
    {id: 16, name: "Colde", balance: 0,avatarUrl: defaultprofile,},
    {id: 17, name: "Colde", balance: 0,avatarUrl: defaultprofile,},
    {id: 18, name: "Colde", balance: 0,avatarUrl: defaultprofile,},
    {id: 19, name: "Colde", balance: 0,avatarUrl: defaultprofile,},
    {id: 20, name: "Colde", balance: 0,avatarUrl: defaultprofile,},
    {id: 21, name: "Colde", balance: 0,avatarUrl: defaultprofile,},
    {id: 22, name: "Colde", balance: 0,avatarUrl: defaultprofile,},
    {id: 23, name: "Colde", balance: 0,avatarUrl: defaultprofile,},
  ];

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
  <h1 className="text-2xl font-hornbill text-twilight">
    Friends
  </h1>

  <button
    onClick={() => setSortAsc(!sortAsc)}
    className="p-2 hover:bg-slate-200 rounded transition"
  >
    <img
      src={sortAsc ? "/assets/icons/12-order.svg" : "/assets/icons/az-order.svg"}
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
                onClick={() => console.log("View profile:", friend.name)}
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
                  onClick={() => console.log("View profile:", friend.name)}
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
        <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)} />
      )}
    </div>
  );
}

export default FriendList;
