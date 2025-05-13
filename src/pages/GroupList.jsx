import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HamburgerMenu from "../Component/HamburgerMenu";
import { Menu, Plus } from "lucide-react";
import Avatar from "../Component/Avatar";
import SearchBar from "../Component/SearchBar";
import defaultprofile from "/assets/icons/defaultprofile.png";
import axios from "axios";

function GroupList() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortAsc, setSortAsc] = useState(true);
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState(null);
  const groupsPerPage = 14;

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get("/api/users/me/groups", {
          withCredentials: true,
        });

        if (response.data) {
          // Format groups data for display
          const formattedGroups = response.data.map((group) => ({
            id: group.id,
            name: group.name,
            description: group.description,
            icon: group.icon,
            // Calculate balance for each group
            balance: group.members.reduce((total, member) => {
              return total + member.amountOwed;
            }, 0),
            members: group.members,
          }));

          setGroups(formattedGroups);
          setError(null);
        } else {
          setError("Failed to load groups");
        }
      } catch (err) {
        console.error("Error loading groups:", err);
        setError("Failed to load groups");
      }
    };

    fetchGroups();
  }, []);

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedGroups = [...filteredGroups].sort((a, b) => {
    return sortAsc
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name);
  });

  const handleSearch = () => {
    console.log("Searching for:", searchTerm);
  };

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

  const totalPages = Math.ceil(sortedGroups.length / groupsPerPage);
  const paginatedGroups = sortedGroups.slice(
    (currentPage - 1) * groupsPerPage,
    currentPage * groupsPerPage
  );

  const navigate = useNavigate();

  const handleGroupClick = (groupId) => {
    navigate(`/groups/${groupId}/items`);
  };

  const handleCreateGroup = () => {
    navigate("/create-group"); // Navigates to the create group page
  };

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
                placeholder="Search groups..."
              />
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <h1 className="text-2xl font-hornbill text-twilight">Groups</h1>
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

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto px-4 pt-4 pb-10">
          {error ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-red-500">{error}</p>
            </div>
          ) : sortedGroups.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-twilight">
              <p className="mb-4">No groups created yet</p>
              <button
                onClick={handleCreateGroup}
                className="px-6 py-3 rounded-[13px] bg-twilight text-white font-semibold flex items-center gap-2"
              >
                <Plus size={18} />
                Create First Group
              </button>
            </div>
          ) : (
            <>
              {/* Desktop List with Pagination */}
              <div className="hidden lg:flex flex-col flex-1">
                <div className="flex-1 w-full max-w-4xl mx-auto columns-2 gap-4 pr-2">
                  {paginatedGroups.map((group) => (
                    <div key={group.id} className="mb-4 break-inside-avoid">
                      <div
                        className="md:w-[390px] sm:w-[145px] h-[71px] rounded-[13px] border border-twilight bg-backg hover:bg-gray-500 hover:shadow-lg hover:backdrop-blur-[18px] transition-all duration-300 p-[13px] box-border flex items-center justify-between cursor-pointer"
                        onClick={() => handleGroupClick(group.id)}
                      >
                        <div className="flex items-center gap-3 overflow-hidden flex-1 min-w-0">
                          <Avatar
                            src={group.avatarUrl || defaultprofile}
                            alt={group.name}
                          />
                          <span className="font-telegraf font-extrabold text-[20px] text-twilight truncate">
                            {group.name}
                          </span>
                        </div>
                        <div
                          className={`font-telegraf font-black text-[20px] min-w-[70px] text-right ${
                            group.balance > 0
                              ? "text-twilight"
                              : group.balance < 0
                              ? "text-dreamy"
                              : "text-paid"
                          }`}
                        >
                          {group.balance > 0
                            ? `+$${Number(group.balance).toFixed(2)}`
                            : group.balance < 0
                            ? `-$${Math.abs(Number(group.balance)).toFixed(2)}`
                            : "$0.00"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination controls */}
                {sortedGroups.length > groupsPerPage && (
                  <div className="py-4 w-full max-w-4xl mx-auto flex justify-center gap-2 border-t mt-auto">
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
                )}
              </div>

              {/* Mobile/Tablet List */}
              <div className="lg:hidden w-full max-w-md mx-auto space-y-4">
                {sortedGroups.map((group) => (
                  <div
                    key={group.id}
                    className="md:w-[390px] sm:w-[145px] h-[71px] rounded-[13px] border border-twilight bg-backg hover:bg-gray-500 hover:shadow-lg hover:backdrop-blur-[18px] transition-all duration-300 p-[13px] box-border flex items-center justify-between cursor-pointer"
                    onClick={() => handleGroupClick(group.id)}
                  >
                    <div className="flex items-center gap-3 overflow-hidden flex-1 min-w-0">
                      <Avatar
                        src={group.avatarUrl || defaultprofile}
                        alt={group.name}
                      />
                      <span className="font-telegraf font-extrabold text-[20px] text-twilight truncate">
                        {group.name}
                      </span>
                    </div>
                    <div
                      className={`font-telegraf font-black text-[20px] min-w-[70px] text-right ${
                        group.balance > 0
                          ? "text-twilight"
                          : group.balance < 0
                          ? "text-dreamy"
                          : "text-paid"
                      }`}
                    >
                      {group.balance > 0
                        ? `+$${Number(group.balance).toFixed(2)}`
                        : group.balance < 0
                        ? `-$${Math.abs(Number(group.balance)).toFixed(2)}`
                        : "$0.00"}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {!error && sortedGroups.length > 0 && (
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleCreateGroup}
              className="w-full max-w-md mx-auto py-3 rounded-[13px] bg-twilight text-white font-semibold flex items-center justify-center gap-2"
            >
              <Plus size={18} />
              Create New Group
            </button>
          </div>
        )}
      </div>

      {/* Overlay (Mobile only) */}
      {!isDesktop && isMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </div>
  );
}

export default GroupList;