import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HamburgerMenu from "../Component/HamburgerMenu";
import { Menu, Plus, User } from "lucide-react";
import FriendCard from "../Component/FriendCard";
import defaultprofile from "/assets/icons/defaultprofile.png";
import SearchBar from "../Component/SearchBar";
import AddMember from "../Component/AddMember";

function GroupForm() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortAsc, setSortAsc] = useState(true);
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(groupId ? true : false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  // number of friends to display per page
  const friendsPerPage = 14;

  // sample friends data for development purposes
  const friends = [
    { id: 1, name: "Alan", balance: 100, avatarUrl: defaultprofile },
    { id: 2, name: "Beauz", balance: -100, avatarUrl: defaultprofile },
    { id: 4, name: "Colde", balance: 0, avatarUrl: defaultprofile },
    { id: 5, name: "Diana", balance: 75, avatarUrl: defaultprofile },
    { id: 6, name: "Eduardo", balance: -50, avatarUrl: defaultprofile },
    { id: 7, name: "Fiona", balance: 125, avatarUrl: defaultprofile },
    { id: 8, name: "George", balance: -25, avatarUrl: defaultprofile },
  ];

  // retrieves and populates existing group data when in edit mode
  useEffect(() => {
    if (groupId) {
      try {
        const groups = JSON.parse(localStorage.getItem("groups") || "[]");
        const groupToEdit = groups.find((g) => g.id === parseInt(groupId));

        if (groupToEdit) {
          setGroupName(groupToEdit.name);
          setGroupDescription(groupToEdit.description || "");
          setSelectedMembers(groupToEdit.members || []);
        } else {
          setError("Group not found");
        }
      } catch (err) {
        console.error("Error loading group:", err);
        setError("Failed to load group data");
      } finally {
        setIsLoading(false);
      }
    }
  }, [groupId]);

  // handles responsive layout changes and updates menu visibility
  useEffect(() => {
    const checkScreenSize = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      setIsMenuOpen(desktop);
      if (desktop && !isDesktop) {
        setIsAddMemberOpen(true);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, [isDesktop]);

  const handleSearch = () => {
    console.log("Searching for:", searchTerm);
  };

  const handleGroupNameChange = (value) => {
    setGroupName(value);
  };

  const handleGroupDescriptionChange = (value) => {
    setGroupDescription(value);
  };

  const handleAddMembers = () => {
    setIsAddMemberOpen(true);
  };

  const handleSaveMembers = (members) => {
    setSelectedMembers(members);
  };

  // saves group data to local storage and redirects to groups page
  const handleSaveGroup = async () => {
    setIsSaving(true);
    setError("");

    try {
      const existingGroups = JSON.parse(localStorage.getItem("groups") || "[]");

      if (groupId) {
        // Update existing group
        const groupIndex = existingGroups.findIndex(
          (g) => g.id === parseInt(groupId)
        );
        if (groupIndex !== -1) {
          existingGroups[groupIndex] = {
            ...existingGroups[groupIndex],
            name: groupName,
            description: groupDescription,
            members: selectedMembers,
            updatedAt: new Date().toISOString(),
            items: existingGroups[groupIndex].items || [],
          };
        }
        localStorage.setItem("groups", JSON.stringify(existingGroups));
        // Changed navigation to /groups
        navigate("/groups");
      } else {
        // Create new group
        const newGroup = {
          id: Date.now(),
          name: groupName,
          description: groupDescription,
          members: selectedMembers,
          createdAt: new Date().toISOString(),
          items: [],
        };
        existingGroups.push(newGroup);
        localStorage.setItem("groups", JSON.stringify(existingGroups));
        // Changed navigation to /groups
        navigate("/groups");
      }
    } catch (error) {
      console.error("Save group error:", error);
      setError(
        `Failed to ${groupId ? "update" : "create"} group. Please try again.`
      );
    } finally {
      setIsSaving(false);
    }
  };

  const menuWidth = "w-72";

  // renders loading state while fetching group data
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-color-dreamy">
        <p className="text-twilight">Loading group details...</p>
      </div>
    );
  }

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
      <div
        className={`flex-1 flex ${isDesktop ? "ml-72 flex-row" : "flex-col"}`}
      >
        {/* Form Section */}
        <div className={`${isDesktop ? "w-1/2" : "w-full"} flex flex-col`}>
          {/* Top Header */}
          <div className="sticky pr-4 z-30 bg-color-dreamy w-full px-4 pt-0 pb-2">
            <div className="flex items-center w-full">
              {!isDesktop && (
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-3 border border-twilight rounded-md"
                >
                  <Menu className="w-5 h-5 text-black" />
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="flex items-center justify-between pl-4 pr-4 pt-4">
              <h2 className="text-4xl font-hornbill text-twilight text-left font-black">
                {groupId ? "Edit Group" : "Create Group"}
              </h2>
            </div>

            {/* Group Name */}
            <h2 className="text-2xl font-hornbill text-twilight text-left font-black pl-4 pt-4">
              Group Name
            </h2>
            <div className="pl-4 pr-4 pt-2 pb-0 max-w-md">
              <div className="flex items-center rounded-[13px] border border-twilight px-4 py-2 bg-transparent">
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => handleGroupNameChange(e.target.value)}
                  placeholder="Enter group name"
                  className="flex-grow outline-none bg-transparent text-twilight placeholder-twilight"
                />
              </div>
            </div>

            {/* Description */}
            <h2 className="text-2xl font-hornbill text-twilight text-left font-black pl-4 pt-4">
              Description
            </h2>
            <div className="pl-4 pr-4 pt-2 pb-4 max-w-md">
              <div className="flex items-center rounded-[13px] border border-twilight px-4 py-2 bg-transparent">
                <input
                  type="text"
                  value={groupDescription}
                  onChange={(e) => handleGroupDescriptionChange(e.target.value)}
                  placeholder="Enter group description"
                  className="flex-grow outline-none bg-transparent text-twilight placeholder-twilight"
                />
              </div>
            </div>

            {/* Members */}
            <h2 className="text-2xl font-hornbill text-twilight text-left font-black pl-4 pt-4">
              Members
            </h2>
            <div className="pl-4 pr-4 pt-2 pb-4 max-h-60 overflow-y-auto">
              {selectedMembers.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {selectedMembers.map((member) => (
                    <FriendCard
                      key={member.id}
                      name={member.name}
                      balance={member.balance}
                      avatarUrl={member.avatarUrl}
                      onClick={() =>
                        console.log("Member clicked:", member.name)
                      }
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-twilight text-opacity-60">
                  <User
                    size={48}
                    className="mb-2 text-twilight text-opacity-40"
                  />
                  <p>No members added yet</p>
                  <p className="text-sm">
                    {isDesktop
                      ? "Select friends from the panel on the right"
                      : 'Click "Add Member" to add people to this group'}
                  </p>
                </div>
              )}
            </div>

            {/* Add Member Button - Mobile Only */}
            {!isDesktop && (
              <div className="pl-4 pr-4 pt-2 pb-8">
                <button
                  onClick={handleAddMembers}
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-[13px] border border-twilight text-twilight hover:bg-twilight hover:text-white transition-colors"
                >
                  <Plus size={16} />
                  <span>Add Member</span>
                </button>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="pl-4 pr-4 pt-2 pb-2">
                <p className="text-red-500">{error}</p>
              </div>
            )}

            {/* Save Button */}
            <div className="pl-4 pr-4 pt-4 pb-8 sticky bottom-0 bg-color-dreamy">
              <button
                onClick={handleSaveGroup}
                disabled={
                  !groupName || selectedMembers.length === 0 || isSaving
                }
                className="w-full max-w-md py-3 rounded-[13px] bg-twilight text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving
                  ? "Saving..."
                  : groupId
                  ? "Save Changes"
                  : "Create Group"}
              </button>
            </div>
          </div>
        </div>

        {/* Add Member Panel - Desktop Only */}
        {isDesktop && (
          <div className="w-1/2 h-screen bg-pale bg-opacity-20 overflow-y-auto">
            <div className="w-full h-full flex flex-col">
              <div className="flex-1 p-6">
                <h2 className="text-4xl font-hornbill text-twilight text-left font-black pb-6">
                  Add Members
                </h2>
                <div className="mb-6">
                  <SearchBar
                    value={searchTerm}
                    onChange={setSearchTerm}
                    onSearch={handleSearch}
                    placeholder="Search friends"
                  />
                </div>
                <div className="pb-4">
                  <div className="grid grid-cols-1 gap-4">
                    {friends.map((friend) => {
                      const isSelected = selectedMembers.some(
                        (member) => member.id === friend.id
                      );
                      return (
                        <div
                          key={friend.id}
                          className={`relative cursor-pointer ${
                            isSelected
                              ? "ring-2 ring-twilight rounded-[13px]"
                              : ""
                          }`}
                          onClick={() => {
                            if (isSelected) {
                              setSelectedMembers(
                                selectedMembers.filter(
                                  (member) => member.id !== friend.id
                                )
                              );
                            } else {
                              setSelectedMembers([...selectedMembers, friend]);
                            }
                          }}
                        >
                          <FriendCard
                            name={friend.name}
                            balance={friend.balance}
                            avatarUrl={friend.avatarUrl}
                          />
                          {isSelected && (
                            <div className="absolute top-2 right-2 bg-twilight rounded-full p-1">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-white"
                              >
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Member Overlay - Mobile Only */}
        {!isDesktop && (
          <AddMember
            isOpen={isAddMemberOpen}
            onClose={() => setIsAddMemberOpen(false)}
            friends={friends}
            selectedMembers={selectedMembers}
            onAddMembers={handleSaveMembers}
          />
        )}

        {/* Overlay (Mobile only) */}
        {!isDesktop && isMenuOpen && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsMenuOpen(false)}
          />
        )}
      </div>
    </div>
  );
}

export default GroupForm;
