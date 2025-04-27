import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HamburgerMenu from "../Component/HamburgerMenu";
import { Menu, X } from "lucide-react";
import Avatar from "../Component/Avatar";
import defaultprofile from "/assets/icons/defaultprofile.png";
import FriendCard from "../Component/FriendCard";

function EditItem() {
  const { groupId, itemId } = useParams();
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
    } finally {
      setIsLoading(false);
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
      <div
        className={`fixed inset-y-0 left-0 z-50 ${menuWidth} transform transition-transform duration-300 ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <HamburgerMenu isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />
      </div>

      <div className="fixed inset-0 z-[90] bg-[#d5d4ff] flex flex-col lg:pl-72">
        <div className="p-4 flex items-center justify-between">
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

        <div className="flex-1 overflow-y-auto px-6">
          <h2 className="text-2xl font-hornbill text-twilight font-black mb-6">
            Edit Item
          </h2>

          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <p className="text-twilight">Loading...</p>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-32">
              <p className="text-red-500">{error}</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="font-telegraf text-twilight font-bold">
                  Item Name
                </label>
                <input
                  type="text"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="w-full rounded-[13px] border border-twilight bg-backg px-4 py-3 text-twilight outline-none mt-2"
                  placeholder="Enter item name"
                />
              </div>

              <div>
                <label className="font-telegraf text-twilight font-bold">
                  Amount
                </label>
                <input
                  type="number"
                  value={itemPrice}
                  onChange={(e) => setItemPrice(e.target.value)}
                  step="0.01"
                  className="w-full rounded-[13px] border border-twilight bg-backg px-4 py-3 text-twilight outline-none mt-2"
                  placeholder="Enter amount"
                />
              </div>

              <div>
                <label className="font-telegraf text-twilight font-bold">
                  Split Between
                </label>
                <div className="space-y-2 mt-2">
                  {group?.members?.map((member) => (
                    <div key={member.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`member-${member.id}`}
                        checked={selectedMembers.includes(member.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedMembers([...selectedMembers, member.id]);
                          } else {
                            setSelectedMembers(
                              selectedMembers.filter((id) => id !== member.id)
                            );
                          }
                        }}
                        className="rounded border-twilight"
                      />
                      <label htmlFor={`member-${member.id}`}>
                        <FriendCard
                          name={member.name}
                          balance={0}
                          avatarUrl={defaultprofile}
                        />
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleUpdateItem}
                  className="flex-1 bg-twilight text-white px-4 py-3 rounded-[13px] font-semibold"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => navigate(`/groups/${groupId}/items`)}
                  className="flex-1 border border-twilight text-twilight px-4 py-3 rounded-[13px] font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
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
