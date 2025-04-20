// components/Navbar.jsx
import { Menu } from "lucide-react";
import SearchBar from "./SearchBar";

const Navbar = ({ isMenuOpen, setIsMenuOpen }) => {
  return (
    <header className="bg-white shadow-sm fixed w-full z-10 py-3">
      <div className="container mx-auto flex items-center px-4">
        {/* Hamburger button - always visible */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="mr-4 p-1 rounded-md focus:outline-none"
        >
          <Menu className="h-6 w-6 text-twilight" />
        </button>
        
        {/* Centered search bar */}
        <div className="flex-1">
          <SearchBar />
        </div>
      </div>
    </header>
  );
};

export default Navbar;