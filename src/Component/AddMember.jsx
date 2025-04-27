import React, { useState, useEffect } from "react";
import { X, Search, Plus, Check } from "lucide-react";
import FriendCardEmpty from "./FriendCardEmpty";

function AddMember({
  isOpen,
  onClose,
  friends,
  selectedMembers,
  onAddMembers,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [localSelectedMembers, setLocalSelectedMembers] = useState([
    ...selectedMembers,
  ]);

  // Filter friends based on search term
  const filteredFriends = friends.filter((friend) =>
    friend.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Check if a friend is already selected
  const isSelected = (friendId) => {
    return localSelectedMembers.some((member) => member.id === friendId);
  };

  // Toggle friend selection
  const toggleFriendSelection = (friend) => {
    if (isSelected(friend.id)) {
      setLocalSelectedMembers(
        localSelectedMembers.filter((member) => member.id !== friend.id)
      );
    } else {
      setLocalSelectedMembers([...localSelectedMembers, friend]);
    }
  };

  // Save selected members and close overlay
  const handleSaveSelection = () => {
    onAddMembers(localSelectedMembers);
    onClose();
  };

  // Close without saving changes
  const handleCancel = () => {
    setLocalSelectedMembers([...selectedMembers]); // Reset to original selection
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-[#d5d4ff] flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-gray-200">
        <h2 className="text-2xl font-hornbill text-twilight font-black">
          Add Members
        </h2>
        <button
          onClick={handleCancel}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <X size={24} className="text-twilight" />
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-4">
        <div className="flex items-center rounded-[13px] border border-twilight px-4 py-2 bg-transparent">
          <Search size={18} className="text-twilight mr-2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search friends"
            className="flex-grow outline-none bg-transparent text-twilight placeholder-twilight"
          />
        </div>
      </div>

      {/* Friends List */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredFriends.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredFriends.map((friend) => (
              <div
                key={friend.id}
                className={`relative cursor-pointer ${
                  isSelected(friend.id)
                    ? "ring-2 ring-twilight rounded-[13px]"
                    : ""
                }`}
                onClick={() => toggleFriendSelection(friend)}
              >
                <div className="h-full w-full">
                  {" "}
                  {/* Add this wrapper div */}
                  <FriendCardEmpty
                    name={friend.name}
                    avatarUrl={friend.avatarUrl}
                    className="h-full w-full" // Add this className prop
                  />
                </div>
                {isSelected(friend.id) && (
                  <div className="absolute top-2 right-2 bg-twilight rounded-full p-1">
                    <Check size={16} className="text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-twilight">
            No friends found matching your search
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-4">
          <button
            onClick={handleCancel}
            className="flex-1 py-3 rounded-[13px] border border-twilight text-twilight font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveSelection}
            className="flex-1 py-3 rounded-[13px] bg-twilight text-white font-semibold"
          >
            Add{" "}
            {localSelectedMembers.length > 0
              ? `(${localSelectedMembers.length})`
              : ""}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddMember;
