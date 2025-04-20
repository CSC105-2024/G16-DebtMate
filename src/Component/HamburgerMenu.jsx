import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
// icons for menu
import createGroupIcon from "/assets/icons/CreateGroups.svg";
import friendsIcon from "/assets/icons/Friends.svg";
import groupsIcon from "/assets/icons/Groups.svg";
import addFriendIcon from "/assets/icons/AddFriend.svg";
import settingsIcon from "/assets/icons/Settings.svg";
import placeImg from "/assets/icons/imgtemp.png";

// breakpoint for Iphone-SE
const XS = "400px";

// updated MenuItem with onClick handler
const MenuItem = ({ icon, text, alt, onClick }) => (
  <li
    className={`flex items-center gap-3 bg-pale rounded-lg border border-black p-2 cursor-pointer hover:bg-dreamy active:bg-dreamy w-[70%] max-[${XS}]:gap-2`}
    onClick={onClick}
  >
    <img
      src={icon}
      alt={alt || text}
      className={`w-6 h-6 max-[${XS}]:w-5 max-[${XS}]:h-5`}
    />
    <span className={`font-telegraf text-black max-[${XS}]:text-sm`}>
      {text}
    </span>
  </li>
);

MenuItem.propTypes = {
  icon: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  alt: PropTypes.string,
  onClick: PropTypes.func,
};

export default function HamburgerMenu({ isOpen, setIsOpen }) {
  const navigate = useNavigate();
  const [isDesktop, setIsDesktop] = useState(false);

  //check screen size and set initial state
  useEffect(() => {
    const checkScreenSize = () => {
    const desktop = window.innerWidth >= 1024;
    setIsDesktop(desktop);

    //if desktop, menu open
    if (desktop) setIsOpen(true);
    };

    checkScreenSize();

    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, [setIsOpen]);

  // handler functions for each menu item
  const handleCreateGroup = () => {
    navigate("/create-group");
    if (!isDesktop) setIsOpen(false); // close menu after clicking
  };

  const handleFriends = () => {
    navigate("/friends");
    if (!isDesktop) setIsOpen(false);
  };

  const handleGroups = () => {
    navigate("/groups");
    if (!isDesktop) setIsOpen(false);
  };

  const handleAddFriend = () => {
    navigate("/add-friend");
    if (!isDesktop) setIsOpen(false);
  };

  const handleSettings = () => {
    navigate("/settings");
    if (!isDesktop) setIsOpen(false);
  };

  const menuItems = [
    {
      icon: createGroupIcon,
      text: "Create Group",
      alt: "Create Group",
      onClick: handleCreateGroup,
    },
    {
      icon: friendsIcon,
      text: "Friends",
      alt: "Friends",
      onClick: handleFriends,
    },
    { icon: groupsIcon, 
      text: "Groups", 
      alt: "Groups", 
      onClick: handleGroups 
    },
    {
      icon: addFriendIcon,
      text: "Add Friend",
      alt: "Add Friend",
      onClick: handleAddFriend,
    },
    {
      icon: settingsIcon,
      text: "Settings",
      alt: "Settings",
      onClick: handleSettings,
    },
  ];

  return (
    <>
      {/* invisible layer to close sidebar when clicking outside */}
      {!isDesktop && isOpen && (
        <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
      )}

      <div
        className={`fixed top-0 left-0 h-full w-[70%] max-w-xs bg-white z-40 shadow-lg transition-transform duration-500 rounded-tr-4xl ${
          isDesktop ? "translate-x-0" : isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* main sidebar stuff */}
        <div className="p-3 pt-0">
          <h2
            className={`font-hornbill font-black text-[50px] text-twilight mt-[2vh] mb-[3vh] max-[${XS}]:text-[40px] max-[${XS}]:leading-tight`}
          >
            Debt Mate
          </h2>

          {/* user profile area */}
          <div className={`flex flex-col px-3 max-[${XS}]:px-2`}>
            <div
              className={`w-22 h-22 bg-gray-300 rounded-full flex items-center justify-center text-gray-500 mb-2 max-[${XS}]:w-16 max-[${XS}]:h-16`}
            >
              <img
                src={placeImg}
                alt="User Profile"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div className="flex flex-col w-full text-left">
              <h2
                className={`font-hornbill font-black text-[30px] text-twilight text-left w-full max-[${XS}]:text-[24px]`}
              >
                Mike Wazowski
              </h2>
              <h3
                className={`font-telegraf font-black text-[17px] text-twilight text-left w-full max-[${XS}]:text-[14px]`}
              >
                @mike_020
              </h3>
            </div>
          </div>

          {/* navigation menu */}
          <div className={`mt-8 px-3 max-[${XS}]:px-2`}>
            <ul className="space-y-4">
              {menuItems.map((item, index) => (
                <MenuItem
                  key={index}
                  icon={item.icon}
                  text={item.text}
                  alt={item.alt}
                  onClick={item.onClick}
                />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

HamburgerMenu.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
};
