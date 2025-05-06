import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HamburgerMenu from "../Component/HamburgerMenu";
import { Menu, X } from "lucide-react";
import Avatar from "../Component/Avatar";
import FriendCard from "../Component/FriendCard";
import defaultprofile from "/assets/icons/defaultprofile.png";

function EditItem() {
  const { groupId, itemId } = useParams();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [group, setGroup] = useState(null);
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [error, setError] = useState(null);
  const menuWidth = "w-72";

  // Load item data
  useEffect(() => {
    try {
      const groups = JSON.parse(localStorage.getItem("groups") || "[]");
      const groupData = groups.find((g) => g.id === parseInt(groupId));

      if (groupData) {
        setGroup(groupData);
        const item = groupData.items?.find((i) => i.id === parseInt(itemId));

        if (item) {
          setItemName(item.name);
          setItemPrice(item.amount.toString());
          setSelectedMembers(item.splitBetween);
          setError(null);
        } else {
          setError("Item not found");
        }
      } else {
        setError("Group not found");
      }
    } catch (err) {
      setError("Failed to load item details");
    }
  }, [groupId, itemId]);

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

  const handleUpdateItem = () => {
    if (!itemName || !itemPrice || selectedMembers.length === 0) {
      setError("Please fill in all fields and select at least one member");
      return;
    }

    try {
      const groups = JSON.parse(localStorage.getItem("groups") || "[]");
      const groupIndex = groups.findIndex((g) => g.id === parseInt(groupId));

      if (groupIndex === -1) {
        setError("Group not found");
        return;
      }

      groups[groupIndex].items = groups[groupIndex].items || [];
      const itemIndex = groups[groupIndex].items.findIndex(
        (i) => i.id === parseInt(itemId)
      );

      if (itemIndex === -1) {
        setError("Item not found");
        return;
      }

      // Update item
      groups[groupIndex].items[itemIndex] = {
        ...groups[groupIndex].items[itemIndex],
        name: itemName,
        amount: parseFloat(itemPrice),
        splitBetween: selectedMembers,
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem("groups", JSON.stringify(groups));
      navigate(`/groups/${groupId}/items`);
    } catch (err) {
      setError("Failed to update item");
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
                  {group?.name || "Edit Item"}
                </h2>
              </div>
            </div>
            <div className="border-b border-twilight my-4 lg:my-2"></div>
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto px-6">
          <div className="lg:max-w-4xl lg:mx-auto lg:w-full">
            {error ? (
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
                    step="0.01"
                    className="w-full rounded-[13px] border border-twilight bg-backg px-4 py-3 lg:py-2 text-twilight outline-none"
                    placeholder="Enter price"
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
                        className={`block w-full cursor-pointer ${
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
                        {/* Use normal div without extra styles */}
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
              <div className="flex gap-4">
                <button
                  onClick={handleUpdateItem}
                  className="flex-1 py-3 lg:py-2 rounded-[13px] bg-twilight text-white font-semibold"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => navigate(`/groups/${groupId}/items`)}
                  className="flex-1 py-3 lg:py-2 rounded-[13px] border border-twilight text-twilight font-semibold"
                >
                  Cancel
                </button>
              </div>
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

export default EditItem;
