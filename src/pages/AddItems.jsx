import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HamburgerMenu from "../Component/HamburgerMenu";
import { Menu, X } from "lucide-react";
import Avatar from "../Component/Avatar";
import FriendCardEmpty from "../Component/FriendCardEmpty";
import NumberInput from "../Component/NumberInput";
import defaultprofile from "/assets/icons/defaultprofile.png";
import axios from "axios";
import { z } from "zod"; 
import { getAvatarUrl } from "../utils/avatarUtils";
import { calculateGroupTotal } from "../utils/groupUtils";

function AddItems() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [group, setGroup] = useState(null);
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [error, setError] = useState(null);

  const itemSchema = z.object({
    name: z.string().min(1, "Item name is required"),
    price: z
      .string()
      .refine((val) => val.length > 0, "Price is required")
      .refine((val) => !isNaN(parseFloat(val)), "Price must be a valid number")
      .refine((val) => parseFloat(val) > 0, "Price must be greater than zero"),
    members: z
      .array(z.number())
      .min(1, "Please select at least one member"),
  });

  const menuWidth = "w-72";

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const timestamp = new Date().getTime();
        const response = await axios.get(
          `/api/groups/${groupId}?t=${timestamp}`,
          {
            withCredentials: true,
          }
        );

        if (response.data) {
          setGroup(response.data);
          setSelectedMembers([]);
          setError(null);
        } else {
          setError("Group not found");
        }
      } catch (err) {
        console.error("Error loading group:", err);
        setError("Failed to load group details");
      }
    };

    fetchGroupData();
  }, [groupId]);

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

  const handleAddItem = async () => {
    try {
      itemSchema.parse({
        name: itemName,
        price: itemPrice,
        members: selectedMembers,
      });

      const price = parseFloat(itemPrice);
      const splitAmount = price / selectedMembers.length;

      const userAssignments = selectedMembers.map((memberId) => ({
        userId: memberId,
        amount: splitAmount,
      }));

      const response = await axios.post(
        `/api/groups/${groupId}/items`,
        {
          name: itemName,
          amount: price,
          userAssignments,
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === 201) {
        // Recalculate group total including tax and service charges
        await calculateGroupTotal(groupId);
        navigate(`/groups/${groupId}/items`);
      } else {
        setError("Failed to add item");
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      } else {
        console.error("Error adding item:", err);
        setError(err.response?.data?.message || "Failed to add item");
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

  // Memoize split amount calculation
  const splitAmount = useMemo(() => {
    if (!itemPrice || !selectedMembers.length) return 0;
    return parseFloat(itemPrice) / selectedMembers.length;
  }, [itemPrice, selectedMembers]);
  
  // Memoize availability of members
  const hasMembers = useMemo(() => {
    return group?.members && group.members.length > 0;
  }, [group?.members]);

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
          className={`fixed inset-y-0 left-0 z-[200] ${menuWidth} transform transition-transform duration-300 ease-in-out ${
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
              className="p-2 rounded-lg border border-twilight hover:bg-gray-100"
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
                <h2 className="text-2xl font-dream text-twilight font-black">
                  {group?.name || "Add Item"}
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
                  <NumberInput
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
                        <FriendCardEmpty
                          userId={memberObj.user.id}
                          name={memberObj.user.name || memberObj.user.username}
                          balance={0}
                          avatarUrl={
                            
                            memberObj.user.avatarUrl || 
                            memberObj.avatarUrl ||
                            memberObj.user.avatar ||
                            (memberObj.user.profile && memberObj.user.profile.avatar) ||
                            defaultprofile
                          }
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
              <button
                onClick={handleAddItem}
                disabled={!hasMembers}
                className="w-full py-3 lg:py-2 rounded-[13px] bg-twilight text-white font-semibold disabled:opacity-50"
              >
                Add Item
              </button>
            </div>
          </div>
        </div>
      </div>

      {!isDesktop && isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-[150] lg:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </div>
  );
}

export default AddItems;