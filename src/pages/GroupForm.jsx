import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HamburgerMenu from "../Component/HamburgerMenu";
import { Menu, Plus, User } from "lucide-react";
import FriendCardEmpty from "../Component/FriendCardEmpty";
import defaultprofile from "/assets/icons/defaultprofile.png";
import SearchBar from "../Component/SearchBar";
import AddMember from "../Component/AddMember";
import ChangeGroupPic from "../Component/ChangeGroupPic";
import group1 from "/assets/icons/group1.svg";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

function GroupForm() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [friends, setFriends] = useState([]);
  const friendsPerPage = 14;

  const [groupPicture, setGroupPicture] = useState(defaultprofile);
  const [isChangePicOpen, setIsChangePicOpen] = useState(false);

  const [originalMembers, setOriginalMembers] = useState([]);
  const [serviceCharge, setServiceCharge] = useState("0");
  const [tax, setTax] = useState("0");

  useEffect(() => {
    const fetchFriends = async () => {
      if (!user) return;

      try {
        const friendsResponse = await axios.get(
          `http://localhost:3000/api/users/${user.id}/friends`,
          {
            withCredentials: true,
          }
        );

        if (friendsResponse.data && friendsResponse.data.success) {
          const formattedFriends = friendsResponse.data.friends.map(
            (friend) => ({
              id: friend.id,
              name: friend.name || friend.username,
              avatarUrl: friend.avatarUrl || defaultprofile,
              username: friend.username,
            })
          );

          setFriends(formattedFriends);
        } else {
          console.error("Failed to fetch friends:", friendsResponse.data);
          setError("Failed to load friends data");

          setFriends([
            {
              id: 1,
              name: "Test Friend 1",
              avatarUrl: defaultprofile,
              username: "friend1",
            },
            {
              id: 2,
              name: "Test Friend 2",
              avatarUrl: defaultprofile,
              username: "friend2",
            },
          ]);
        }
      } catch (err) {
        console.error("Error fetching friends:", err);
        setError("Failed to load friends. Using mock data for now.");

        setFriends([
          {
            id: 1,
            name: "Test Friend 1",
            avatarUrl: defaultprofile,
            username: "friend1",
          },
          {
            id: 2,
            name: "Test Friend 2",
            avatarUrl: defaultprofile,
            username: "friend2",
          },
        ]);
      }
    };

    fetchFriends();
  }, [user]);

  useEffect(() => {
    const fetchGroupData = async () => {
      if (!groupId) {
        return;
      }

      try {
        const response = await axios.get(`/api/groups/${groupId}`, {
          withCredentials: true,
        });

        if (response.data) {
          const group = response.data;
          setGroupName(group.name);
          setGroupDescription(group.description || "");

          const groupMembers = group.members.map((memberObj) => ({
            id: memberObj.user.id,
            name: memberObj.user.name || memberObj.user.username,
            avatarUrl: memberObj.user.avatarUrl || defaultprofile,
            username: memberObj.user.username,
          }));

          const filteredMembers = groupMembers.filter(
            (member) => member.id !== user?.id
          );

          setSelectedMembers(filteredMembers);
          setOriginalMembers([...filteredMembers]);

          if (group.icon) {
            setGroupPicture(group.icon);
          }
        } else {
          setError("Group not found");
        }
      } catch (err) {
        console.error("Error loading group:", err);
        setError("Failed to load group data");
      }
    };

    fetchGroupData();
  }, [groupId, user]);

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

  const handleSearch = () => {};

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

  const handleSaveGroup = async () => {
    if (!groupName || selectedMembers.length === 0) {
      setError("Group name and at least one member are required");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      const memberIds = selectedMembers.map((member) => member.id);

      if (groupId) {
        if (originalMembers) {
          const removedMembers = originalMembers.filter(
            (originalMember) => !memberIds.includes(originalMember.id)
          );

          if (removedMembers.length > 0) {
            const itemsResponse = await axios.get(
              `/api/groups/${groupId}/items`,
              {
                withCredentials: true,
              }
            );

            if (itemsResponse.data && Array.isArray(itemsResponse.data)) {
              const items = itemsResponse.data;
              const itemUpdatePromises = [];

              for (const item of items) {
                if (!item.users || !Array.isArray(item.users)) continue;

                const hasRemovedMember = item.users.some((assignment) =>
                  removedMembers.some(
                    (member) =>
                      assignment.userId === member.id ||
                      (assignment.user && assignment.user.id === member.id)
                  )
                );

                if (hasRemovedMember) {
                  const remainingUsers = item.users.filter((assignment) => {
                    const userId =
                      assignment.userId ||
                      (assignment.user && assignment.user.id);
                    return !removedMembers.some(
                      (removedMember) => userId === removedMember.id
                    );
                  });

                  if (remainingUsers.length === 0) {
                    continue;
                  }

                  const splitAmount = parseFloat(
                    (Number(item.amount) / remainingUsers.length).toFixed(2)
                  );

                  const userAssignments = remainingUsers.map((assignment) => {
                    const userId =
                      assignment.userId ||
                      (assignment.user && assignment.user.id);
                    return {
                      userId: userId,
                      amount: splitAmount,
                    };
                  });

                  const payload = {
                    name: item.name,
                    amount: Number(item.amount),
                    userAssignments: userAssignments.map((assignment) => ({
                      userId:
                        typeof assignment.userId === "string"
                          ? parseInt(assignment.userId, 10)
                          : Number(assignment.userId),
                      amount: Number(assignment.amount),
                    })),
                  };

                  const updatePromise = new Promise((resolve) => {
                    setTimeout(async () => {
                      try {
                        resolve({ success: true, item: item.id });
                      } catch (updateError) {
                        resolve({
                          success: false,
                          item: item.id,
                          error:
                            updateError.response?.data?.message ||
                            updateError.message,
                        });
                      }
                    }, 300);
                  });

                  itemUpdatePromises.push(updatePromise);
                }
              }

              if (itemUpdatePromises.length > 0) {
                const results = await Promise.all(itemUpdatePromises);
                const failedUpdates = results.filter((r) => !r.success);

                if (failedUpdates.length > 0) {
                  // Consider handling failures more gracefully
                }
              }
            }
          }
        }

        const response = await axios.put(
          `/api/groups/${groupId}`,
          {
            name: groupName,
            description: groupDescription || "",
            icon: groupPicture !== defaultprofile ? groupPicture : null,
          },
          { withCredentials: true }
        );

        const existingMemberIds = originalMembers.map((m) => m.id);
        for (const memberId of memberIds) {
          if (!existingMemberIds.includes(memberId)) {
            try {
              await axios.post(
                `/api/groups/${groupId}/members`,
                { userId: memberId },
                { withCredentials: true }
              );
            } catch (addError) {
              if (addError.response?.status !== 400) {
                setError(
                  `Failed to add member. ${
                    addError.response?.data?.message || ""
                  }`
                );
              }
            }
          }
        }

        for (const originalMember of originalMembers) {
          if (!memberIds.includes(originalMember.id)) {
            try {
              await axios.delete(
                `/api/groups/${groupId}/members/${originalMember.id}`,
                { withCredentials: true }
              );
            } catch (removeErr) {}
          }
        }

        if (response.status === 200) {
          navigate(`/groups/${groupId}/items`);
        } else {
          setError("Failed to update group. Please try again.");
        }
      } else {
        const response = await axios.post(
          "/api/groups",
          {
            name: groupName,
            description: groupDescription || "",
            icon: groupPicture !== defaultprofile ? groupPicture : null,
            serviceCharge: parseFloat(serviceCharge) || 0,
            tax: parseFloat(tax) || 0,
            members: memberIds,
          },
          { withCredentials: true }
        );

        if (response.status === 201) {
          navigate(`/groups/${response.data.id}/items`);
        } else {
          setError("Failed to create group. Please try again.");
        }
      }
    } catch (error) {
      const errorDetail = error.response?.data?.message || error.message;
      setError(
        `Failed to ${groupId ? "update" : "create"} group: ${errorDetail}`
      );
    } finally {
      setIsSaving(false);
    }
  };

  const toggleMemberSelection = (friend) => {
    const isAlreadySelected = selectedMembers.some(
      (member) => member.id === friend.id
    );

    if (isAlreadySelected) {
      setSelectedMembers(
        selectedMembers.filter((member) => member.id !== friend.id)
      );
    } else {
      setSelectedMembers([...selectedMembers, friend]);
    }
  };

  const filteredFriends = friends.filter((friend) =>
    searchTerm
      ? friend.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        friend.username?.toLowerCase().includes(searchTerm.toLowerCase())
      : true
  );

  const menuWidth = "w-72";

  const totalPages = Math.ceil(filteredFriends.length / friendsPerPage);
  const paginatedFriends = filteredFriends.slice(
    (currentPage - 1) * friendsPerPage,
    currentPage * friendsPerPage
  );

  return (
    <div className="flex bg-color-dreamy h-screen overflow-hidden">
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

      <div
        className={`flex-1 flex ${isDesktop ? "ml-72 flex-row" : "flex-col"}`}
      >
        <div className={`${isDesktop ? "w-1/2" : "w-full"} flex flex-col`}>
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
            {error ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-red-500">{error}</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between pl-4 pr-4 pt-4">
                  <h2 className="text-4xl font-hornbill text-twilight text-left font-black">
                    {groupId ? "Edit Group" : "Create Group"}
                  </h2>
                </div>

                <div className="flex justify-center pt-6">
                  <div
                    className="w-24 h-24 rounded-full overflow-hidden mb-4 cursor-pointer"
                    onClick={() => setIsChangePicOpen(true)}
                  >
                    <img
                      src={groupPicture || group1}
                      alt="Group Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

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

                <h2 className="text-2xl font-hornbill text-twilight text-left font-black pl-4 pt-4">
                  Description
                </h2>
                <div className="pl-4 pr-4 pt-2 pb-4 max-w-md">
                  <div className="flex items-center rounded-[13px] border border-twilight px-4 py-2 bg-transparent">
                    <input
                      type="text"
                      value={groupDescription}
                      onChange={(e) =>
                        handleGroupDescriptionChange(e.target.value)
                      }
                      placeholder="Enter group description"
                      className="flex-grow outline-none bg-transparent text-twilight placeholder-twilight"
                    />
                  </div>
                </div>

                <h2 className="text-2xl font-hornbill text-twilight text-left font-black pl-4 pt-4">
                  Members
                </h2>
                <div className="pl-4 pr-4 pt-2 pb-4 max-h-60 overflow-y-auto">
                  {selectedMembers.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                      {selectedMembers.map((member) => (
                        <FriendCardEmpty
                          key={member.id}
                          name={member.name}
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

                {error && (
                  <div className="pl-4 pr-4 pt-2 pb-2">
                    <p className="text-red-500">{error}</p>
                  </div>
                )}

                <div className="pl-4 pr-4 pt-4 pb-8 sticky bottom-0 bg-color-dreamy">
                  <button
                    onClick={handleSaveGroup}
                    disabled={
                      !groupName || selectedMembers.length === 0 || isSaving
                    }
                    className="w-full max-w-md py-3 rounded-[13px] font-hornbill bg-twilight text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving
                      ? "Saving..."
                      : groupId
                      ? "Save Changes"
                      : "Create Group"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

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
                  {friends.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8">
                      <p className="text-twilight">
                        No friends found. Add some friends first!
                      </p>
                    </div>
                  ) : filteredFriends.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8">
                      <p className="text-twilight">
                        No friends match your search
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {paginatedFriends.map((friend) => {
                        const isSelected = selectedMembers.some(
                          (member) => member.id === friend.id
                        );
                        return (
                          <div
                            key={friend.id}
                            className="relative"
                            onClick={() => toggleMemberSelection(friend)}
                          >
                            <div
                              className="h-[71px] cursor-pointer rounded-[13px] overflow-hidden"
                              style={{
                                boxShadow: isSelected
                                  ? "0 0 0 2pxrgb(0, 0, 0)"
                                  : "none",
                                border: "2px solid rgba(79, 70, 229, 0.3)",
                              }}
                            >
                              <FriendCardEmpty
                                name={friend.name}
                                avatarUrl={friend.avatarUrl}
                              />
                            </div>
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
                  )}

                  {totalPages > 1 && (
                    <div className="flex justify-center mt-4 gap-2">
                      <button
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                        className="px-3 py-1 rounded border border-twilight text-twilight disabled:opacity-50"
                      >
                        Prev
                      </button>
                      <span className="px-3 py-1">
                        {currentPage} of {totalPages}
                      </span>
                      <button
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
                        }
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 rounded border border-twilight text-twilight disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {!isDesktop && (
          <AddMember
            isOpen={isAddMemberOpen}
            onClose={() => setIsAddMemberOpen(false)}
            friends={friends}
            selectedMembers={selectedMembers}
            onAddMembers={handleSaveMembers}
          />
        )}

        {!isDesktop && isMenuOpen && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsMenuOpen(false)}
          />
        )}
      </div>

      {isChangePicOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-[13px] shadow-lg">
            <ChangeGroupPic
              onClose={() => setIsChangePicOpen(false)}
              onConfirm={(newPic) => {
                setGroupPicture(newPic);
                setIsChangePicOpen(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default GroupForm;
