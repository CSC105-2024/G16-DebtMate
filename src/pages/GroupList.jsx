import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HamburgerMenu from "../Component/HamburgerMenu";
import { Menu, Plus } from "lucide-react";
import FriendCard from "../Component/FriendCard"; // Or replace with GroupCard if available
import defaultprofile from "/assets/icons/defaultprofile.png";
import SearchBar from "../Component/SearchBar";

function GroupList() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortAsc, setSortAsc] = useState(true);
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const groupsPerPage = 14;
  // Fetch groups from API
  useEffect(() => {
    const fetchGroups = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("http://localhost:3000/api/groups", {
          credentials: "include", // Send auth token cookie
        });

        if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          // Transform API results to component-friendly format
          const transformedGroups = data.groups.map((group) => ({
            id: group.id,
            name: group.name,
            balance: 0, // You might calculate this based on group transactions
            avatarUrl: defaultprofile,
          }));

          setGroups(transformedGroups);
        } else {
          setError(data.message || "Failed to fetch groups");
        }
      } catch (err) {
        console.error("Error fetching groups:", err);
        setError("Failed to connect to the server");
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroups();
  }, []);

  // Filter groups based on search term
  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort groups by name if needed
  const sortedGroups = [...filteredGroups].sort((a, b) => {
    return sortAsc
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name);
  });

  const handleSearch = () => {
    console.log("Searching for:", searchTerm);
    // Search is handled by the filteredGroups already
  };

  const handleCreateGroup = () => {
    navigate("/create-group");
  };

  const handleGroupClick = (groupId) => {
    navigate(`/groups/${groupId}/items`);
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

  const totalPages = Math.ceil(sortedGroups.length / groupsPerPage);
  const paginatedGroups = sortedGroups.slice(
    (currentPage - 1) * groupsPerPage,
    currentPage * groupsPerPage
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
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-twilight">Loading groups...</p>
            </div>
          ) : error ? (
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
              {/* Mobile/Tablet List */}
              <div className="lg:hidden w-full max-w-md mx-auto space-y-4">
                {sortedGroups.map((group) => (
                  <FriendCard
                    key={group.id}
                    name={group.name}
                    balance={group.balance}
                    avatarUrl={group.avatarUrl}
                    onClick={() => handleGroupClick(group.id)}
                  />
                ))}
              </div>

              {/* Desktop List with Pagination */}
              <div className="hidden lg:flex flex-col flex-1">
                <div className="flex-1 w-full max-w-4xl mx-auto columns-2 gap-4 pr-2">
                  {paginatedGroups.map((group) => (
                    <div key={group.id} className="mb-4 break-inside-avoid">
                      <FriendCard
                        name={group.name}
                        balance={group.balance}
                        avatarUrl={group.avatarUrl}
                        onClick={() => handleGroupClick(group.id)}
                      />
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
            </>
          )}
        </div>

        {/* Create Group Button (when groups exist) */}
        {!isLoading && !error && sortedGroups.length > 0 && (
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
