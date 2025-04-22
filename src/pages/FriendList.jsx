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

  return (
    <div className="flex  bg-color-dreamy ">
      {/* Desktop Menu - only visible on large screens */}
      {isDesktop && (
        <div className={`fixed inset-y-0 left-0 z-50 ${menuWidth} min-h-screen`}>
          <HamburgerMenu isOpen={true} setIsOpen={setIsMenuOpen} />
        </div>
      )}

      {/* Mobile Menu - only visible on mobile when menu is open */}
      {!isDesktop && (
        <div 
          className={`fixed inset-y-0 left-0 z-50 ${menuWidth} transform transition-transform duration-300 ease-in-out ${
            isMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <HamburgerMenu isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:ml-72">
        {/* Top Bar with Menu Button and Search */}
        <div className="flex items-center justify-center gap-3 px-4 pt-4">
          {/* Menu button - only on mobile */}
          {!isDesktop && (
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-3 border border-twilight rounded-md ${isMenuOpen ? 'invisible' : 'visible'} transition-opacity duration-300`}
            >
              <Menu className="w-5 h-5 text-black" />
            </button>
          )}

          {/* Search Bar */}
          <div className="flex-grow max-w-md mx-auto">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              onSearch={handleSearch}
              placeholder="Search friends..."
            />
          </div>
        </div>

        {/* Friend List */}
        <div className="flex justify-center px-4 pt-8">
          <div className="w-full max-w-md">
            <h1 className="text-2xl font-hornbill text-twilight mb-6 text-center">Friend List</h1>
            <div className="space-y-4">
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
        </div>
      </div>

      {/* Overlay to close menu when clicking outside - mobile only */}
      {!isDesktop && isMenuOpen && (
        <div 
          className="fixed inset-0"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </div>
  );
}

export default FriendList;