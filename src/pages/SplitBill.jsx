import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HamburgerMenu from "../Component/HamburgerMenu";
import { Menu, X } from "lucide-react";
import Avatar from "../Component/Avatar";
import defaultprofile from "/assets/icons/defaultprofile.png";
import axios from "axios";
import { getAvatarUrl, getDisplayName } from "../utils/avatarUtils";
import { updateGroupTotal } from "../utils/groupUtils";

function SplitBill() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [group, setGroup] = useState(null);
  const [memberTotals, setMemberTotals] = useState({});
  const [grandTotal, setGrandTotal] = useState(0);
  const [error, setError] = useState(null);
  const [paidMembers, setPaidMembers] = useState({}); 
  const currency = localStorage.getItem("currency") || "$";
  const menuWidth = "w-72";

  useEffect(() => {
    const fetchGroupAndCalculate = async () => {
      try {
        let currentGroup;
        let billData;

        try {
          const timestamp = new Date().getTime();
          const response = await axios.get(
            `/api/groups/${groupId}?t=${timestamp}`,
            {
              withCredentials: true,
            }
          );

          if (response.data) {
            currentGroup = response.data;

            billData = JSON.parse(
              localStorage.getItem(`bill_${groupId}`) || "{}"
            );
          }
        } catch (apiErr) {
          console.log("API fetch failed, falling back to localStorage", apiErr);

          const groups = JSON.parse(localStorage.getItem("groups") || "[]");
          currentGroup = groups.find((g) => g.id === parseInt(groupId));
          billData = JSON.parse(
            localStorage.getItem(`bill_${groupId}`) || "{}"
          );
        }

        if (!currentGroup) {
          setError("Group not found");
          return;
        }

        setGroup(currentGroup);
        
        const ownerId = currentGroup.ownerId || (currentGroup.owner && currentGroup.owner.id);
        
        const paidStatus = {};
        if (currentGroup.members) {
          currentGroup.members.forEach((member) => {
            const memberId = member.userId || (member.user ? member.user.id : member.id);
            if (memberId !== ownerId) { // Skip the owner
              paidStatus[memberId] = member.isPaid || false;
            }
          });
        }
        setPaidMembers(paidStatus);

        const totals = {};
        let subtotal = 0;

        if (currentGroup.members) {
          currentGroup.members.forEach((member) => {
            const memberId = member.userId || (member.user ? member.user.id : member.id);
            if (memberId !== ownerId) { // Skip the owner
              totals[memberId] = 0;
            }
          });
        }

        if (currentGroup.items) {
          currentGroup.items.forEach((item) => {
            const itemAmount = parseFloat(item.amount);
            let splitMembers;

            if (item.users && item.users.length > 0) {
              // Include all users
              splitMembers = item.users.map((u) => u.userId || u.user?.id);
            } else if (item.splitBetween && item.splitBetween.length > 0) {
              // Include all specified split members
              splitMembers = item.splitBetween;
            } else {
              // Include all group members
              splitMembers = currentGroup.members.map((m) => m.userId || m.user?.id || m.id);
            }

            if (!splitMembers || splitMembers.length === 0) {
              return;
            }

            const splitAmount = itemAmount / splitMembers.length;

            splitMembers.forEach((memberId) => {
              // Only add to totals if the member is not the owner
              if (memberId !== ownerId) {
                totals[memberId] = (totals[memberId] || 0) + splitAmount;
              }
            });

            subtotal += itemAmount;
          });
        }

        const serviceChargeRate = parseFloat(billData.serviceCharge || 0) / 100;
        const taxRate = parseFloat(billData.tax || 0) / 100;

        const serviceChargeAmount = subtotal * serviceChargeRate;
        const taxAmount = subtotal * taxRate;
        const extraAmount = serviceChargeAmount + taxAmount;
        const finalTotal = subtotal + extraAmount;

        Object.keys(totals).forEach((memberId) => {
          if (subtotal > 0) {
            const proportion = totals[memberId] / subtotal;
            const memberExtra = extraAmount * proportion;
            totals[memberId] += memberExtra;
          }
          
          // Auto-mark members who owe $0 as paid
          if (Math.abs(totals[memberId]) < 0.01) {
            paidStatus[memberId] = true;
          }
        });

        setMemberTotals(totals);
        setPaidMembers(paidStatus);
        setGrandTotal(finalTotal);
        setError(null);
      } catch (err) {
        console.error("Error calculating splits:", err);
        setError("Failed to calculate bill splits");
      }
    };

    fetchGroupAndCalculate();
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

  const getMemberName = (memberId) => {
    if (!group || !group.members) {
      return { name: "Unknown", avatar: defaultprofile };
    }

    const numericId = Number(memberId);

    const member = group.members.find((m) => {
      if (m.user) {
        const userId = Number(m.user.id);
        return userId === numericId;
      } else {
        const userId = Number(m.userId || m.id);
        return userId === numericId;
      }
    });

    if (!member) {
      return { name: "Unknown", avatar: defaultprofile };
    }

    if (member.user) {
      return {
        name: member.user.name || member.user.username || "Unknown",
        avatar: member.user.avatarUrl || defaultprofile,
      };
    }
    return {
      name: member.name || member.username || "Unknown",
      avatar: member.avatarUrl || defaultprofile,
    };
  };
  const togglePaymentStatus = async (memberId) => {
    try {
      const newPaidStatus = !paidMembers[memberId];

      setPaidMembers((prev) => ({
        ...prev,
        [memberId]: newPaidStatus,
      }));

      await axios.put(
        `/api/groups/${groupId}/members/${memberId}/paid`,
        { isPaid: newPaidStatus },
        { withCredentials: true }
      );
      
      const newRemainingTotal = Object.entries(memberTotals)
        .reduce((total, [id, amount]) => {
          const isPaid = id === memberId ? newPaidStatus : paidMembers[id];
          return total + (isPaid ? 0 : amount);
        }, 0);
      
      await updateGroupTotal(groupId, newRemainingTotal);
      
    } catch (err) {
      console.error("Error updating payment status:", err);
      
      setPaidMembers((prev) => ({
        ...prev,
        [memberId]: !prev[memberId],
      }));
    }
  };

  const remainingToSettle = Object.entries(memberTotals)
    .reduce((total, [memberId, amount]) => {
      return total + (paidMembers[memberId] ? 0 : amount);
    }, 0);

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
                alt={getDisplayName(group, "Group")}
                size="lg"
              />
              <div className="flex items-center justify-between flex-1">
                <h2 className="text-2xl text-twilight font-dream font-black">
                  {group?.name || "Group"}
                </h2>
              </div>
            </div>
            <div className="border-b border-twilight my-4 lg:my-2"></div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6">
          <div className="lg:max-w-4xl lg:mx-auto lg:w-full">
            {error ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-red-500">{error}</p>
              </div>
            ) : (
              <div className="space-y-6 lg:max-w-xl lg:mx-auto">
                <h2 className="text-3xl text-twilight font-hornbill font-black">
                  Split Bill
                </h2>

                <div className="space-y-4">
                  {Object.entries(memberTotals)
                    .sort((a, b) => b[1] - a[1])
                    .map(([memberId, amount]) => {
                      if (memberId === String(group?.ownerId) || memberId === String(group?.owner?.id)) {
                        return null;
                      }

                      return (
                        <div
                          key={memberId}
                          className={`rounded-[13px] border ${
                            paidMembers[memberId]
                              ? "border-green-500 bg-green-50"
                              : "border-twilight bg-backg"
                          } p-4 flex justify-between items-center cursor-pointer`}
                          onClick={() => togglePaymentStatus(memberId)}
                        >
                          <div className="flex items-center gap-3">
                            <Avatar
                              src={getMemberName(memberId).avatar}
                              alt={getMemberName(memberId).name}
                              size="sm"
                            />
                            <div className="flex flex-col">
                              <span className="font-telegraf text-twilight">
                                {getMemberName(memberId).name}
                              </span>
                            </div>
                          </div>
                          <span
                            className={`font-telegraf font-bold ${
                              paidMembers[memberId] ? "text-green-600" : "text-twilight"
                            }`}
                          >
                            {currency} {amount?.toFixed(2) || "0.00"}
                          </span>
                        </div>
                      );
                    })}
                </div>

                <div className="border-t border-twilight my-4 lg:block lg:border-t lg:border-twilight lg:my-6"></div>

                <div className="flex justify-between items-center">
                  <span className="font-telegraf text-twilight font-bold">
                    Left to Settle:
                  </span>
                  <span className="font-telegraf font-bold text-twilight">
                    {currency} {remainingToSettle.toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="px-6 py-4">
          <div className="lg:max-w-4xl lg:mx-auto lg:w-full">
            <div className="lg:max-w-xl lg:mx-auto">
              <button
                onClick={() => navigate("/groups")}
                className="w-full py-3 lg:py-2 rounded-[13px] bg-twilight text-white font-semibold"
              >
                Exit
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

export default SplitBill;