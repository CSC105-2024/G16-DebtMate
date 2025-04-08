import React, { useState } from "react";
import HamburgerMenu from "../Component/HamburgerMenu";
import { Menu } from "lucide-react";

function FriendList() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="relative">
      <div className="md:hidden">
        {/* Menu icon */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="z-20 p-3 fixed top-4 left-4 bg-color-dreamy border border-twilight rounded-md"
        >
          <Menu className="w-6 h-6 text-black" />
        </button>

        {/* Hamburger component handle the siderbar */}
        <HamburgerMenu isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />
      </div>

      <div className="p-6">
        <h1 className="text-2xl font-bold">Friend List Page</h1>
      </div>
    </div>
  );
}

export default FriendList;
