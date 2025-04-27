import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HamburgerMenu from "../Component/HamburgerMenu";
import { Menu, X } from "lucide-react";
import Avatar from "../Component/Avatar";
import FriendCard from "../Component/FriendCard";
import defaultprofile from "/assets/icons/defaultprofile.png";

function AddItems() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [group, setGroup] = useState(null);
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const menuWidth = "w-72";

  // Fetch group details from localStorage
  useEffect(() => {
    try {
      const groups = JSON.parse(localStorage.getItem("groups") || "[]");
      const foundGroup = groups.find((g) => g.id === parseInt(groupId));

      if (foundGroup) {
        setGroup(foundGroup);
        setError(null);
      } else {
        setError("Group not found");
      }
    } catch (err) {
      console.error("Error loading group:", err);
      setError("Failed to load group details");
    } finally {
      setIsLoading(false);
    }
  }, [groupId]);

  // Handle responsive layout
  useEffect(() => {
    const checkScreenSize = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      setIsMenuOpen(desktop);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const handleAddItem = () => {
    if (!itemName || !itemPrice || selectedMembers.length === 0) {
      setError("Please fill in all fields and select at least one member");
      return;
    }

    try {
      // Get current groups from localStorage
      const groups = JSON.parse(localStorage.getItem("groups") || "[]");
      const groupIndex = groups.findIndex((g) => g.id === parseInt(groupId));

      if (groupIndex === -1) {
        setError("Group not found");
        return;
      }

      // Create new item with unique ID
      const newItemId = Date.now();
      const newItem = {
        id: newItemId,
        name: itemName,
        amount: parseFloat(itemPrice),
        splitBetween: selectedMembers,
        addedBy: JSON.parse(localStorage.getItem("currentUser"))?.id || 0,
        createdAt: new Date().toISOString(),
      };

      // Add item to group's items array
      if (!groups[groupIndex].items) {
        groups[groupIndex].items = [];
      }
      groups[groupIndex].items.push(newItem);

      // Save updated groups back to localStorage
      localStorage.setItem("groups", JSON.stringify(groups));

      // Navigate back to the items list page instead of the edit page
      navigate(`/groups/${groupId}/items`);
    } catch (err) {
      console.error("Error adding item:", err);
      setError("Failed to add item");
    }
  };

  return (
    <div className="flex h-screen bg-color-dreamy">
      {isDesktop ? (
        <div
          className={`fixed inset-y-0 left-0 z-[150] ${menuWidth} bg-[#d5d4ff]`}
        >
          <HamburgerMenu isOpen={true} setIsOpen={setIsMenuOpen} />
        </div>
      ) : (
        <div
          className={`fixed inset-y-0 left-0 z-50 ${menuWidth} transform transition-transform duration-300 ${
            isMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <HamburgerMenu isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />
        </div>
      )}

      {/* Main Content */}
      <div
        className={`fixed inset-0 z-[90] bg-[#d5d4ff] flex flex-col ${
          isDesktop ? "ml-72" : ""
        }`}
      >
        {/* Header */}
        <div className="p-4 lg:p-2 flex items-center justify-between lg:max-w-4xl lg:mx-auto lg:w-full">
          {!isDesktop && (
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <Menu size={24} className="text-twilight" />
            </button>
          )}
          <div className="flex-1"></div>
          <button
            onClick={() => navigate(`/groups/${groupId}/items`)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <X size={24} className="text-twilight" />
          </button>
        </div>

        {/* Group Info Section */}
        <div className="px-6 pb-2">
          <div className="lg:max-w-4xl lg:mx-auto lg:w-full">
            <div className="flex items-center gap-3 mb-2">
              <Avatar
                src={group?.avatarUrl || defaultprofile}
                alt={group?.name || "Group"}
                size="lg"
              />
              <div className="flex items-center justify-between flex-1">
                <h2 className="text-2xl font-hornbill text-twilight font-black">
                  {group?.name || "Add Item"}
                </h2>
              </div>
            </div>
            <div className="border-b border-twilight my-4 lg:my-2"></div>
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto px-6">
          <div className="lg:max-w-4xl lg:mx-auto lg:w-full">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-twilight">Loading...</p>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-red-500">{error}</p>
              </div>
            ) : (
              <div className="space-y-6 lg:max-w-xl lg:mx-auto">
                <div className="space-y-2">
                  <h3 className="font-telegraf text-twilight font-bold">
                    Item
                  </h3>
                  <input
                    type="text"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    placeholder="Enter item name"
                    className="w-full rounded-[13px] border border-twilight bg-backg px-4 py-3 lg:py-2 text-twilight outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <h3 className="font-telegraf text-twilight font-bold">
                    Price
                  </h3>
                  <input
                    type="number"
                    value={itemPrice}
                    onChange={(e) => setItemPrice(e.target.value)}
                    placeholder="Enter price"
                    className="w-full rounded-[13px] border border-twilight bg-backg px-4 py-3 lg:py-2 text-twilight outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <h3 className="font-telegraf text-twilight font-bold">
                    Split Between
                  </h3>
                  <div className="space-y-2">
                    {group?.members?.map((member) => (
                      <div
                        key={member.id}
                        className={`w-full cursor-pointer ${
                          selectedMembers.includes(member.id)
                            ? "ring-2 ring-twilight rounded-[13px]"
                            : ""
                        }`}
                        onClick={() => {
                          if (selectedMembers.includes(member.id)) {
                            setSelectedMembers(
                              selectedMembers.filter((id) => id !== member.id)
                            );
                          } else {
                            setSelectedMembers([...selectedMembers, member.id]);
                          }
                        }}
                      >
                        <FriendCard
                          name={member.name}
                          balance={0}
                          avatarUrl={member.avatarUrl || defaultprofile}
                          className="w-full lg:!w-full"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Button */}
        <div className="px-6 py-4">
          <div className="lg:max-w-4xl lg:mx-auto lg:w-full">
            <div className="lg:max-w-xl lg:mx-auto">
              <button
                onClick={handleAddItem}
                className="w-full py-3 lg:py-2 rounded-[13px] bg-twilight text-white font-semibold"
              >
                Add Item
              </button>
            </div>
          </div>
        </div>
      </div>

      {!isDesktop && isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </div>
  );
}

export default AddItems;
