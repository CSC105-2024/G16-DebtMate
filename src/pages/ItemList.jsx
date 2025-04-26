import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HamburgerMenu from "../Component/HamburgerMenu";
import { Menu, Plus, X } from "lucide-react";
import Avatar from "../Component/Avatar";
import defaultprofile from "/assets/icons/defaultprofile.png";

function ItemList() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [group, setGroup] = useState(null);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [serviceCharge, setServiceCharge] = useState("10");
  const [tax, setTax] = useState("7");

  // Calculate total based on items, service charge, and tax
  const itemsTotal = items.reduce(
    (sum, item) => sum + (parseFloat(item.amount) || 0),
    0
  );
  const serviceChargeAmount = itemsTotal * (parseFloat(serviceCharge) / 100);
  const taxAmount = itemsTotal * (parseFloat(tax) / 100);
  const total = itemsTotal + serviceChargeAmount + taxAmount;

  // Menu width consistent between mobile and desktop
  const menuWidth = "w-72";

  // Fetch group details
  useEffect(() => {
    const fetchGroupDetails = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `http://localhost:3000/api/groups/${groupId}`,
          {
            credentials: "include",
          }
        );
        const data = await response.json();

        if (data.success) {
          setGroup(data.group);
          // In the future, also fetch items for this group
          setItems([]);
        } else {
          setError(data.message || "Failed to load group details");
        }
      } catch (err) {
        console.error("Error fetching group:", err);
        setError("Failed to connect to the server");
      } finally {
        setIsLoading(false);
      }
    };

    if (groupId) {
      fetchGroupDetails();
    } else {
      setError("No group ID provided");
      setIsLoading(false);
    }
  }, [groupId]);

  // Handle responsive layout based on screen size
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
    navigate(`/groups/${groupId}/add-item`);
  };

  const handleSplitBill = () => {
    // Implement split bill functionality here
    console.log("Split bill clicked");
  };

  return (
    <div className="flex h-screen bg-color-dreamy">
      {/* Hamburger Menu */}
      <div
        className={`fixed inset-y-0 left-0 z-50 ${menuWidth} transform transition-transform duration-300 ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <HamburgerMenu isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />
      </div>

      {/* Main Content - Using Fixed Position Layout */}
      <div className="fixed inset-0 z-[90] bg-[#d5d4ff] flex flex-col lg:pl-72">
        {/* Header with close button */}
        <div className="p-4 flex items-center justify-between">
          {!isDesktop && (
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <Menu size={24} className="text-twilight" />
            </button>
          )}
          <div className="flex-1"></div> {/* Spacer */}
          <button
            onClick={() => navigate("/groups")}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <X size={24} className="text-twilight" />
          </button>
        </div>

        {/* Group Info Section */}
        <div className="px-6 pb-2">
          <div className="flex items-center gap-3 mb-2">
            <Avatar
              src={defaultprofile}
              alt={group?.name || "Group"}
              size="lg"
            />
            <div className="flex items-center justify-between flex-1">
              <h2 className="text-2xl font-hornbill text-twilight font-black">
                {group?.name || "Group Items"}
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

        {/* Add Item Button at Top */}
        <div className="px-6 mb-4">
          <button
            onClick={handleAddItem}
            className="w-full py-3 rounded-[13px] bg-twilight text-white font-semibold flex items-center justify-center gap-2"
          >
            <Plus size={18} />
            Add Item
          </button>
        </div>

        {/* Items List - Scrollable */}
        <div className="flex-1 overflow-y-auto px-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-twilight">Loading...</p>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-red-500">{error}</p>
            </div>
          ) : items.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-twilight text-opacity-60">
              <p>No items added yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="rounded-[13px] border border-twilight bg-backg p-3 flex justify-between items-center"
                >
                  <span className="font-telegraf font-semibold text-twilight">
                    {item.name}
                  </span>
                  <span className="font-telegraf font-bold text-twilight">
                    ${parseFloat(item.amount).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Divider line after items list */}
        <div className="px-6 mt-4">
          <div className="border-t border-gray-300 my-3"></div>
        </div>

        {/* Bottom section with service charge, tax and total */}
        <div className="px-6 mt-2">
          {/* Service Charge Row */}
          <div className="flex justify-between items-center mb-3">
            <span className="font-telegraf text-twilight">
              Service Charges (%)
            </span>
            <div className="w-20 rounded-[13px] border border-twilight bg-backg px-4 py-2">
              <input
                type="text"
                value={serviceCharge}
                onChange={(e) => setServiceCharge(e.target.value)}
                className="w-full bg-transparent text-twilight text-right outline-none"
              />
            </div>
          </div>

          {/* Tax Row */}
          <div className="flex justify-between items-center mb-3">
            <span className="font-telegraf text-twilight">Tax (%)</span>
            <div className="w-20 rounded-[13px] border border-twilight bg-backg px-4 py-2">
              <input
                type="text"
                value={tax}
                onChange={(e) => setTax(e.target.value)}
                className="w-full bg-transparent text-twilight text-right outline-none"
              />
            </div>
          </div>

          {/* Total Row */}
          <div className="flex justify-between items-center mb-5">
            <span className="font-telegraf font-bold text-twilight text-lg">
              Total:
            </span>
            <span className="font-telegraf font-bold text-twilight text-lg">
              ${total.toFixed(2)}
            </span>
          </div>

          {/* Split Button */}
          <div className="mb-5">
            <button
              onClick={handleSplitBill}
              className="w-full py-3 rounded-[13px] bg-twilight text-white font-semibold"
            >
              Split
            </button>
          </div>
        </div>
      </div>

      {/* Overlay to close menu when clicking outside - mobile only */}
      {!isDesktop && isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </div>
  );
}

export default ItemList;
