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
        <div className="p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Edit Item</h1>

            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="font-telegraf text-twilight font-bold">
                  Item Name
                </label>
                <input
                  type="text"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="w-full rounded-[13px] border border-twilight bg-backg px-4 py-3 text-twilight outline-none"
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
                  className="w-full rounded-[13px] border border-twilight bg-backg px-4 py-3 text-twilight outline-none"
                  placeholder="Enter amount"
                />
              </div>

              <div>
                <label className="font-telegraf text-twilight font-bold">
                  Split Between
                </label>
                <div className="space-y-2">
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

              <div className="flex gap-4">
                <button
                  onClick={handleUpdateItem}
                  className="flex-1 bg-twilight text-white px-4 py-2 rounded-[13px]"
                >
                  Update Item
                </button>
                <button
                  onClick={() => navigate(`/groups/${groupId}/items`)}
                  className="flex-1 border border-twilight text-twilight px-4 py-2 rounded-[13px]"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditItem;
