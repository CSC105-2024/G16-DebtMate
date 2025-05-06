// component for splitting bills between group members
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HamburgerMenu from "../Component/HamburgerMenu";
import { Menu, X } from "lucide-react";
import Avatar from "../Component/Avatar";
import FriendCard from "../Component/FriendCard";
import defaultprofile from "/assets/icons/defaultprofile.png";

function SplitBill() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [group, setGroup] = useState(null);
  const [memberTotals, setMemberTotals] = useState({});
  const [grandTotal, setGrandTotal] = useState(0);
  const [error, setError] = useState(null);
  const currency = localStorage.getItem("currency");
  const menuWidth = "w-72";

  // hook to handle bill splitting calculations
  useEffect(() => {
    const calculateSplits = () => {
      try {
        const groups = JSON.parse(localStorage.getItem("groups") || "[]");
        const billData = JSON.parse(
          localStorage.getItem(`bill_${groupId}`) || "{}"
        );
        const currentGroup = groups.find((g) => g.id === parseInt(groupId));

        if (!currentGroup) {
          setError("Group not found");
          return;
        }

        setGroup(currentGroup);

        // Calculate totals for each member
        const totals = {};
        let subtotal = 0;

        // initialize totals for all members
        currentGroup.members.forEach((member) => {
          totals[member.id] = 0;
        });

        // calculate splits for each item
        currentGroup.items?.forEach((item) => {
          const itemAmount = parseFloat(item.amount);
          const splitMembers = item.splitBetween;
          const splitAmount = itemAmount / splitMembers.length;

          splitMembers.forEach((memberId) => {
            totals[memberId] = (totals[memberId] || 0) + splitAmount;
          });

          subtotal += itemAmount;
        });

        const serviceChargeAmount = subtotal * (billData.serviceCharge / 100);
        const taxAmount = subtotal * (billData.tax / 100);
        const finalTotal = subtotal + serviceChargeAmount + taxAmount;

        const totalMembers = currentGroup.members.length;
        const extraPerPerson = (serviceChargeAmount + taxAmount) / totalMembers;

        // add extra charges to each member's total
        Object.keys(totals).forEach((memberId) => {
          totals[memberId] += extraPerPerson;
        });

        setMemberTotals(totals);
        setGrandTotal(finalTotal);
        setError(null);
      } catch (err) {
        console.error("Error calculating splits:", err);
        setError("Failed to calculate bill splits");
      }
    };

    calculateSplits();
  }, [groupId]);

  // handle responsive layout
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

  return (
    <div className="flex h-screen bg-color-dreamy">
      {/* hamburger menu */}
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

      {/* main content */}
      <div
        className={`fixed inset-0 z-[90] bg-[#d5d4ff] flex flex-col ${
          isDesktop ? "ml-72" : ""
        }`}
      >
        {/* header */}
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

        {/* group info */}
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
                  {group?.name || "Group"}
                </h2>
              </div>
            </div>
            <div className="border-b border-twilight my-4 lg:my-2"></div>
          </div>
        </div>

        {/* split bill content */}
        <div className="flex-1 overflow-y-auto px-6">
          <div className="lg:max-w-4xl lg:mx-auto lg:w-full">
            {error ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-red-500">{error}</p>
              </div>
            ) : (
              <div className="space-y-6 lg:max-w-xl lg:mx-auto">
                <h2 className="text-3xl font-hornbill text-twilight font-black">
                  Split Bill
                </h2>

                {/* member list */}
                <div className="space-y-4">
                  {group?.members?.map((member) => (
                    <div
                      key={member.id}
                      className="rounded-[13px] border border-twilight bg-backg p-4 flex justify-between items-center"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={member.avatarUrl || defaultprofile}
                          alt={member.name}
                          size="sm"
                        />
                        <span className="font-telegraf text-twilight">
                          {member.name}
                        </span>
                      </div>
                      <span className="font-telegraf font-bold text-twilight">
                        {currency}{" "}
                        {memberTotals[member.id]?.toFixed(2) || "0.00"}
                      </span>
                    </div>
                  ))}
                </div>

                {/* separator */}
                <div className="border-t border-twilight my-4 lg:block lg:border-t lg:border-twilight lg:my-6"></div>

                {/* left to settle */}
                <div className="flex justify-between items-center">
                  <span className="font-telegraf text-twilight font-bold">
                    Left to Settle:
                  </span>
                  <span className="font-telegraf font-bold text-twilight">
                    {currency} {grandTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* exit button */}
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

      {/* mobile overlay */}
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
