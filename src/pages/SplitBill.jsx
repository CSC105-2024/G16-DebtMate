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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const currency = localStorage.getItem("currency");
  const menuWidth = "w-72";

  // hook to handle bill splitting calculations
  useEffect(() => {
    const calculateSplits = () => {
      setIsLoading(true);
      try {
        // get groups and bill data from localStorage
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

        // add service charge and tax from billData
        const serviceChargeAmount = subtotal * (billData.serviceCharge / 100);
        const taxAmount = subtotal * (billData.tax / 100);
        const finalTotal = subtotal + serviceChargeAmount + taxAmount;

        // distribute service charge and tax equally among all members
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
      } finally {
        setIsLoading(false);
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
      <div
        className={`fixed inset-y-0 left-0 z-50 ${menuWidth} transform transition-transform duration-300 ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <HamburgerMenu isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />
      </div>

      {/* main content */}
      <div className="fixed inset-0 z-[90] bg-[#d5d4ff] flex flex-col lg:pl-72">
        {/* header */}
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

        {/* group info */}
        <div className="px-6 pb-2">
          <div className="flex items-center gap-3 mb-2">
            <Avatar
              src={defaultprofile}
              alt={group?.name || "Group"}
              size="lg"
            />
            <div className="flex items-center justify-between flex-1">
              <h2 className="text-2xl font-hornbill text-twilight font-black">
                {group?.name || "Group"}
              </h2>
              <button
                onClick={() => navigate(`/edit-group/${groupId}`)}
                className="p-2 rounded-full hover:bg-gray-100"
                aria-label="Edit group"
              >
                <img
                  src="/assets/icons/esIcon.svg"
                  alt="Edit"
                  className="w-5 h-5"
                />
              </button>
            </div>
          </div>
          <div className="border-b border-gray-300 my-3"></div>
        </div>

        {/* split bill content */}
        <div className="flex-1 overflow-y-auto px-6">
          <h2 className="text-2xl font-hornbill text-twilight font-bold mb-6">
            Split Bill
          </h2>

          {/* total amount */}
          <div className="flex justify-between items-center mb-6">
            <span className="font-telegraf text-twilight text-lg">Total:</span>
            <span className="font-telegraf font-bold text-twilight text-lg">
              {currency} {grandTotal.toFixed(2)}
            </span>
          </div>

          {/* member list */}
          <div className="space-y-4 mb-6">
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
                  {currency} {memberTotals[member.id]?.toFixed(2) || "0.00"}
                </span>
              </div>
            ))}
          </div>

          {/* separator */}
          <div className="border-t border-gray-300 my-6"></div>

          {/* left to settle */}
          <div className="flex justify-between items-center mb-6">
            <span className="font-telegraf text-twilight font-bold">
              Left to Settle:
            </span>
            <span className="font-telegraf font-bold text-twilight">
              {currency} {grandTotal.toFixed(2)}
            </span>
          </div>

          {/* exit button */}
          <div className="mb-6">
            <button
              onClick={() => navigate("/groups")}
              className="w-full py-3 rounded-[13px] bg-twilight text-white font-semibold"
            >
              Exit
            </button>
          </div>
        </div>
      </div>

      {/* mobile overlay */}
      {!isDesktop && isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </div>
  );
}

export default SplitBill;
