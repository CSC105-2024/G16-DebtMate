import React, { useState, useEffect } from "react";
import HamburgerMenu from "../Component/HamburgerMenu";
import { Menu } from "lucide-react";

function FriendList() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      setIsMenuOpen(desktop); // Auto-open on desktop
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <div className="relative">
      {/* Only show button on mobile */}
      {!isDesktop && (
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="z-20 p-3 fixed top-4 left-4 bg-color-dreamy border border-twilight rounded-md"
        >
          <Menu className="w-6 h-6 text-black" />
        </button>
      )}

      {/* Hamburger menu - will stay open on desktop */}
      <HamburgerMenu isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />

      <div className="p-6">
        <h1 className="text-2xl font-bold">Friend List Page</h1>
      </div>
    </div>
  );
}

export default FriendList;
