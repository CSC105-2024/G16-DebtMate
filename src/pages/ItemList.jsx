import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HamburgerMenu from "../Component/HamburgerMenu";
import { Menu, Plus, X } from "lucide-react";
import Avatar from "../Component/Avatar";
import defaultprofile from "/assets/icons/defaultprofile.png";
import ItemCard from "../Component/ItemCard";

function ItemList() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [group, setGroup] = useState(null);
  const [items, setItems] = useState([]);
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
  const currency = localStorage.getItem("currency");

  // Menu width consistent between mobile and desktop
  const menuWidth = "w-72";
  // Fetch group details
  useEffect(() => {
    const fetchGroupDetails = () => {
      try {
        // Get groups from localStorage
        const groups = JSON.parse(localStorage.getItem("groups") || "[]");
        const groupData = groups.find((g) => g.id === parseInt(groupId));

        if (groupData) {
          setGroup(groupData);
          // Set items from group data if it exists
          setItems(groupData.items || []);
          setError(null);
        } else {
          setError("Group not found");
        }
      } catch (err) {
        console.error("Error loading group:", err);
        setError("Failed to load group data");
      }
    };

    if (groupId) {
      fetchGroupDetails();
    } else {
      setError("No group ID provided");
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
    navigate(`/groups/${groupId}/items/add`);
  };

  // handle split bill navigation with bill data
  const handleSplitBill = () => {
    // save current bill data to localStorage before navigation
    const billData = {
      serviceCharge: parseFloat(serviceCharge),
      tax: parseFloat(tax),
      total: total,
    };
    localStorage.setItem(`bill_${groupId}`, JSON.stringify(billData));

    // navigate to split bill page
    navigate(`/groups/${groupId}/split`);
  };

  // Add totalPages calculation
  const itemsPerPage = 8; // Showing 8 items per page on desktop
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const [currentPage, setCurrentPage] = useState(1);

  // Get paginated items for desktop view
  const paginatedItems = items.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex h-screen bg-color-dreamy">
      {/* Hamburger Menu - Modified for consistent desktop behavior */}
      {isDesktop ? (
        <div
          className={`fixed inset-y-0 left-0 z-[150] ${menuWidth} bg-[#d5d4ff]`}
        >
          <HamburgerMenu isOpen={true} setIsOpen={setIsMenuOpen} />
        </div>
      ) : (
        <div
          className={`fixed inset-y-0 left-0 z-[200] ${menuWidth} transform transition-transform duration-300 ${
            isMenuOpen ? "translate-x-0" : "-translate-x-full"
          } bg-[#d5d4ff]`}
        >
          <HamburgerMenu isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />
        </div>
      )}

      {/* Main Content - Using Fixed Position Layout */}
      <div
        className={`fixed inset-0 z-[90] bg-[#d5d4ff] flex flex-col ${
          isDesktop ? "ml-72" : ""
        }`}
      >
        {/* Header with close button */}
        <div className="p-4 lg:p-2 flex items-center justify-between lg:max-w-4xl lg:mx-auto lg:w-full">
          {!isDesktop && (
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 border border-twilight"
            >
              <Menu size={24} className="text-twilight" />
            </button>
          )}
          <div className="flex-1"></div>
          <button
            onClick={() => navigate("/groups")}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <X size={24} className="text-twilight" />
          </button>
        </div>

        {/* Group Info Section */}
        <div className="px-6 pb-2 lg:pb-1">
          <div className="lg:max-w-4xl lg:mx-auto lg:w-full">
            <div className="flex items-center gap-3 mb-2">
              <Avatar
                src={defaultprofile}
                alt={group?.name || "Group"}
                size="lg"
              />
              <div className="flex items-center justify-between flex-1">
                <h2 className="text-3xl font-hornbill text-twilight font-black pl-2">
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
                    className="w-6 h-6"
                  />
                </button>
              </div>
            </div>
            {/* Separator line */}
            <div className="border-b border-twilight my-4 lg:my-2"></div>
          </div>
        </div>

        {/* Add Item Button - Make smaller in desktop mode */}
        <div className="px-6 mb-4 lg:mb-2">
          <div className="w-full lg:max-w-4xl lg:mx-auto">
            <button
              onClick={handleAddItem}
              className="w-full text-2xl lg:text-lg font-telegraf font-black py-5 lg:py-2 rounded-[13px] border border-twilight bg-backg text-twilight font-semibold flex items-center justify-center gap-2 hover:bg-gray-100"
            >
              <Plus size={18} className="lg:w-4 lg:h-4" />
              Add Item
            </button>
          </div>
        </div>

        {/* Modified Items List Section */}
        <div className="flex-1 overflow-y-auto px-6 lg:overflow-visible lg:flex lg:flex-col">
          {error ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-red-500">{error}</p>
            </div>
          ) : items.length === 0 ? (
            <div className="w-full lg:max-w-4xl lg:mx-auto flex items-center justify-center h-32 text-twilight text-opacity-60">
              <p>No items added yet</p>
            </div>
          ) : (
            <>
              {/* Mobile/Tablet View */}
              <div className="lg:hidden space-y-3 pt-4">
                {items.map((item, index) => (
                  <ItemCard
                    key={index}
                    item={item}
                    currency={currency}
                    onClick={() =>
                      navigate(`/groups/${groupId}/items/${item.id}/edit`)
                    }
                  />
                ))}
              </div>

              {/* Desktop View - Two Column Layout */}
              <div className="hidden lg:block lg:flex-1 lg:overflow-y-auto max-h-[calc(100vh-380px)]">
                <div className="w-full max-w-4xl mx-auto columns-2 gap-2 pr-2 pt-4">
                  {paginatedItems.map((item, index) => (
                    <div
                      key={index}
                      className="mb-2 break-inside-avoid lg:scale-85 lg:transform lg:-translate-y-3"
                    >
                      <ItemCard
                        item={item}
                        currency={currency}
                        onClick={() =>
                          navigate(`/groups/${groupId}/items/${item.id}/edit`)
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Desktop Pagination - Outside scroll area */}
              {items.length > itemsPerPage && (
                <div className="hidden lg:flex py-2 w-full max-w-4xl mx-auto justify-center gap-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="px-2 py-1 bg-twilight text-white text-sm rounded-[13px] disabled:opacity-50"
                  >
                    Prev
                  </button>
                  <span className="px-3 py-1 text-twilight text-sm font-semibold">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="px-2 py-1 bg-twilight text-white text-sm rounded-[13px] disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Bottom section with service charge, tax and total */}
        <div className="px-6 mt-1">
          <div className="w-full lg:max-w-4xl lg:mx-auto">
            {/* Service Charge Row */}
            <div className="flex justify-between items-center mb-3 lg:mb-1">
              <span className="font-telegraf text-xl lg:text-base text-twilight">
                Service Charges (%)
              </span>
              <div className="w-20 lg:w-16 rounded-[13px] border border-twilight bg-backg px-4 lg:px-2 py-2 lg:py-1 flex items-center">
                <input
                  type="text"
                  value={serviceCharge}
                  onChange={(e) => setServiceCharge(e.target.value)}
                  className="w-full bg-transparent text-twilight text-right outline-none"
                />
                <span className="text-twilight ml-1">%</span>
              </div>
            </div>

            {/* Tax Row */}
            <div className="flex justify-between items-center mb-3 lg:mb-1">
              <span className="font-telegraf text-xl lg:text-base text-twilight">
                Tax (%)
              </span>
              <div className="w-20 lg:w-16 rounded-[13px] border border-twilight bg-backg px-4 lg:px-2 py-2 lg:py-1 flex items-center">
                <input
                  type="text"
                  value={tax}
                  onChange={(e) => setTax(e.target.value)}
                  className="w-full bg-transparent text-twilight text-right outline-none"
                />
                <span className="text-twilight ml-1">%</span>
              </div>
            </div>

            {/* Total Row */}
            <div className="flex justify-between items-center mb-5 lg:mb-2">
              <span className="font-hornbill font-bold text-twilight text-2xl lg:text-lg">
                Total:
              </span>
              <span className="font-telegraf font-bold text-twilight text-2xl lg:text-lg">
                {currency} {total.toFixed(2)}
              </span>
            </div>

            {/* Split Button */}
            <div className="mb-5 lg:mb-2">
              <button
                onClick={handleSplitBill}
                className="w-[50%] py-3 lg:py-1.5 rounded-[13px] bg-twilight text-white text-2xl lg:text-lg font-hornbill"
              >
                Split
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay to close menu when clicking outside - mobile only */}
      {!isDesktop && isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-[150] lg:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </div>
  );
}

export default ItemList;
