import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HamburgerMenu from "../Component/HamburgerMenu";
import { Menu, X } from "lucide-react";
import Avatar from "../Component/Avatar";
import FriendCard from "../Component/FriendCard";
import NumberInput from "../Component/NumberInput";
import defaultprofile from "/assets/icons/defaultprofile.png";
import axios from "axios";
import { z } from "zod";
import { getAvatarUrl } from "../utils/avatarUtils";
import { calculateGroupTotal } from "../utils/groupUtils";

function EditItem() {
  const { groupId, itemId } = useParams();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [group, setGroup] = useState(null);
  const [item, setItem] = useState(null);
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [error, setError] = useState(null);
  const [memberRemovedFromGroup, setMemberRemovedFromGroup] = useState(false);
  const menuWidth = "w-72";

  const itemSchema = z.object({
    name: z.string().min(1, "Item name is required"),
    price: z
      .string()
      .refine((val) => val.length > 0, "Price is required")
      .refine((val) => !isNaN(parseFloat(val)), "Price must be a valid number")
      .refine((val) => parseFloat(val) > 0, "Price must be greater than zero"),
    members: z.array(z.number()).min(1, "Please select at least one member"),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const timestamp = new Date().getTime();

        const groupResponse = await axios.get(
          `/api/groups/${groupId}?t=${timestamp}`,
          {
            withCredentials: true,
          }
        );

        if (!groupResponse.data) {
          throw new Error("Group not found");
        }

        setGroup(groupResponse.data);

        const itemResponse = await axios.get(
          `/api/items/${itemId}?t=${timestamp}`,
          {
            withCredentials: true,
          }
        );

        if (!itemResponse.data) {
          throw new Error("Item not found");
        }

        const itemData = itemResponse.data;
        setItem(itemData);
        setItemName(itemData.name);
        setItemPrice(itemData.amount?.toString() || "");

        if (itemData.users && itemData.users.length > 0) {
          const userIds = itemData.users.map((assignment) => assignment.userId);
          setSelectedMembers(userIds);

          const groupMemberIds = groupResponse.data.members.map(
            (m) => m.user.id
          );
          const removedUsers = userIds.filter(
            (id) => !groupMemberIds.includes(id)
          );

          if (removedUsers.length > 0) {
            setMemberRemovedFromGroup(true);
            setSelectedMembers(
              userIds.filter((id) => groupMemberIds.includes(id))
            );
          }
        }

        setError(null);
      } catch (err) {
        console.error("Error loading data:", err);
        setError(err.message || "Failed to load item details");

        try {
          const groups = JSON.parse(localStorage.getItem("groups") || "[]");
          const groupData = groups.find((g) => g.id === parseInt(groupId));

          if (groupData) {
            setGroup(groupData);
            const item = groupData.items?.find(
              (i) => i.id === parseInt(itemId)
            );

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
        } catch (localErr) {
          console.error("Error with localStorage fallback:", localErr);
        }
      }
    };

    if (groupId && itemId) {
      fetchData();
    }
  }, [groupId, itemId]);

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

  const handleUpdateItem = async () => {
    try {
      itemSchema.parse({
        name: itemName,
        price: itemPrice,
        members: selectedMembers,
      });

      const price = parseFloat(itemPrice);
      const splitAmount = parseFloat(
        (price / selectedMembers.length).toFixed(2)
      );

      const userAssignments = selectedMembers.map((memberId) => ({
        userId: memberId,
        amount: splitAmount,
      }));

      await axios.put(
        `/api/items/${itemId}`,
        {
          name: itemName,
          amount: price,
          userAssignments,
        },
        {
          withCredentials: true,
        }
      );

      // Calculate group total including tax and service charges
      // This will also update all member amounts
      await calculateGroupTotal(groupId);
      navigate(`/groups/${groupId}/items`);
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      } else {
        console.error("Error updating item:", err);
        setError(err.response?.data?.message || "Failed to update item");
      }
    }
  };

  const toggleMemberSelection = (memberId) => {
    if (selectedMembers.includes(memberId)) {
      setSelectedMembers(selectedMembers.filter((id) => id !== memberId));
    } else {
      setSelectedMembers([...selectedMembers, memberId]);
    }
  };

  const hasMembers = group?.members && group.members.length > 0;

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

        <div className="px-6 pb-2">
          <div className="lg:max-w-4xl lg:mx-auto lg:w-full">
            <div className="flex items-center gap-3 mb-2">
              <Avatar
                src={getAvatarUrl(group, "group")}
                alt={group?.name || "Group"}
                size="lg"
              />
              <div className="flex items-center justify-between flex-1">
                <h2 className="text-2xl text-twilight font-black">
                  {group?.name || "Edit Item"}
                </h2>
              </div>
            </div>
            <div className="border-b border-twilight my-4 lg:my-2"></div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6">
          <div className="lg:max-w-4xl lg:mx-auto lg:w-full">
            {!hasMembers ? (
              <div className="flex flex-col items-center justify-center h-64">
                <p className="text-twilight mb-2">This group has no members.</p>
                <button
                  onClick={() => navigate(`/edit-group/${groupId}`)}
                  className="px-4 py-2 bg-twilight text-white rounded-[13px]"
                >
                  Add Members
                </button>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center mt-8">
                <p className="text-red-500 mb-4">{error}</p>
                <button
                  onClick={() => setError(null)}
                  className="px-4 py-2 bg-twilight text-white rounded-[13px] font-semibold"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <div className="space-y-6 lg:max-w-xl lg:mx-auto">
                {memberRemovedFromGroup && (
                  <div className="bg-yellow-100 text-yellow-800 p-3 rounded-lg mb-4">
                    Some users who were part of this expense are no longer in the
                    group.
                  </div>
                )}

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
                  <NumberInput
                    label="Price"
                    value={itemPrice}
                    onChange={setItemPrice}
                    placeholder="Enter price"
                    allowDecimals={true}
                  />
                </div>

                <div className="space-y-2">
                  <h3 className="font-telegraf text-twilight font-bold">
                    Split Between
                  </h3>
                  <div className="space-y-2">
                    {group?.members?.map((memberObj) => (
                      <div
                        key={memberObj.user.id}
                        className={`w-full cursor-pointer ${
                          selectedMembers.includes(memberObj.user.id)
                            ? "ring-2 ring-twilight rounded-[13px]"
                            : ""
                        }`}
                        onClick={() => toggleMemberSelection(memberObj.user.id)}
                      >
                        <FriendCard
                          userId={memberObj.user.id}
                          name={memberObj.user.name || memberObj.user.username}
                          balance={0}
                          avatarUrl={memberObj.user.avatarUrl || defaultprofile}
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

        <div className="px-6 py-4">
          <div className="lg:max-w-4xl lg:mx-auto lg:w-full">
            <div className="lg:max-w-xl lg:mx-auto">
              <div className="flex gap-4">
                <button
                  onClick={handleUpdateItem}
                  disabled={!hasMembers || selectedMembers.length === 0}
                  className="flex-1 py-3 lg:py-2 rounded-[13px] bg-twilight text-white font-semibold disabled:opacity-50"
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