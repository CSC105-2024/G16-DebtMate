import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HamburgerMenu from "../Component/HamburgerMenu";
import { Menu, Plus, X } from "lucide-react";
import Avatar from "../Component/Avatar";
import { getAvatarUrl, getDisplayName } from "../utils/avatarUtils";
import ItemCard from "../Component/ItemCard";
import axios from "axios";
import NumberInput from "../Component/NumberInput";

function ItemList() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [group, setGroup] = useState(null);
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [serviceCharge, setServiceCharge] = useState("");
  const [tax, setTax] = useState("");
  const [updateTimer, setUpdateTimer] = useState(null);

  const itemsTotal = items.reduce(
    (sum, item) => sum + (parseFloat(item.amount) || 0),
    0
  );
  const serviceChargeAmount = itemsTotal * (parseFloat(serviceCharge) / 100);
  const taxAmount = itemsTotal * (parseFloat(tax) / 100);
  const total = itemsTotal + serviceChargeAmount + taxAmount;
  const currency = localStorage.getItem("currency");

  const menuWidth = "w-72";

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        const response = await axios.get(`/api/groups/${groupId}`, {
          withCredentials: true,
        });

        if (response.data) {
          setGroup(response.data);
          setItems(response.data.items || []);
          setServiceCharge((response.data.serviceCharge || 0).toString());
          setTax((response.data.tax || 0).toString());
          setError(null);
        } else {
          throw new Error("Failed to fetch group data");
        }
      } catch (apiErr) {
        console.error("API Error:", apiErr);

        try {
          const groups = JSON.parse(localStorage.getItem("groups") || "[]");
          const groupData = groups.find((g) => g.id === parseInt(groupId));

          if (groupData) {
            setGroup(groupData);
            setItems(groupData.items || []);
            setServiceCharge((groupData.serviceCharge || 0).toString());
            setTax((groupData.tax || 0).toString());
            setError(null);
          } else {
            setError("Group not found");
          }
        } catch (localErr) {
          console.error("Error loading group from localStorage:", localErr);
          setError("Failed to load group data");
        }
      }
    };

    if (groupId) {
      fetchGroupDetails();
    } else {
      setError("No group ID provided");
    }
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

  const handleAddItem = () => {
    navigate(`/groups/${groupId}/items/add`);
  };

  const handleSplitBill = () => {
    const billData = {
      serviceCharge: parseFloat(serviceCharge),
      tax: parseFloat(tax),
      total: total,
    };
    localStorage.setItem(`bill_${groupId}`, JSON.stringify(billData));

    navigate(`/groups/${groupId}/split`);
  };

  const updateGroupSettings = async (field, value) => {
    try {
      const parsedValue = parseFloat(value) || 0;

      if (field === "serviceCharge") {
        setServiceCharge(value);
      } else if (field === "tax") {
        setTax(value);
      }

      if (updateTimer) clearTimeout(updateTimer);

      const timer = setTimeout(async () => {
        const payload = {
          name: group?.name || "Group",
          description: group?.description || "",
        };

        payload[field] = parsedValue;

        try {
          const response = await axios.put(`/api/groups/${groupId}`, payload, {
            withCredentials: true,
          });

          if (response.data) {
            setGroup((prev) => ({
              ...prev,
              [field]: parsedValue,
            }));
          }
        } catch (err) {
          if (field === "serviceCharge") {
            setServiceCharge(group?.serviceCharge?.toString() || "0");
          } else if (field === "tax") {
            setTax(group?.tax?.toString() || "0");
          }
        }
      }, 500);

      setUpdateTimer(timer);
    } catch (err) {
      console.error(`Error updating group ${field}:`, err);
    }
  };

  const itemsPerPage = 8;
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const [currentPage, setCurrentPage] = useState(1);

  const paginatedItems = items.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
          className={`fixed inset-y-0 left-0 z-[200] ${menuWidth} transform transition-transform duration-300 ${
            isMenuOpen ? "translate-x-0" : "-translate-x-full"
          } bg-[#d5d4ff]`}
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

        <div className="px-6 pb-2 lg:pb-1">
          <div className="lg:max-w-4xl lg:mx-auto lg:w-full">
            <div className="flex items-center gap-3 mb-2">
              <Avatar
                src={getAvatarUrl(group, "group")}
                alt={getDisplayName(group, "Group")}
                size="lg"
              />
              <div className="flex items-center justify-between flex-1">
                <h2 className="text-3xl text-twilight font-black pl-2">
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
            <div className="border-b border-twilight my-4 lg:my-2"></div>
          </div>
        </div>

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

        <div className="px-6 mt-1">
          <div className="w-full lg:max-w-4xl lg:mx-auto">
            <div className="flex justify-between items-center mb-3 lg:mb-1">
              <span className="font-telegraf text-xl lg:text-base text-twilight">
                Service Charges (%)
              </span>
              <NumberInput
                value={serviceCharge}
                onChange={(value) =>
                  updateGroupSettings("serviceCharge", value)
                }
                suffix="%"
                className="w-28 lg:w-24"
                hideArrows={true}
                inputProps={{
                  style: { textAlign: "right", paddingRight: "4px" },
                  maxLength: 5,
                }}
              />
            </div>

            <div className="flex justify-between items-center mb-3 lg:mb-1">
              <span className="font-telegraf text-xl lg:text-base text-twilight">
                Tax (%)
              </span>
              <NumberInput
                value={tax}
                onChange={(value) => updateGroupSettings("tax", value)}
                suffix="%"
                className="w-28 lg:w-24"
                hideArrows={true}
                inputProps={{
                  style: { textAlign: "right", paddingRight: "4px" },
                  maxLength: 5,
                }}
              />
            </div>

            <div className="flex justify-between items-center mb-5 lg:mb-2">
              <span className="text-twilight font-hornbill font-bold text-2xl lg:text-lg">
                Total:
              </span>
              <span className="font-telegraf font-bold text-twilight text-2xl lg:text-lg">
                {currency} {total.toFixed(2)}
              </span>
            </div>

            <div className="mb-5 lg:mb-2">
              <button
                onClick={handleSplitBill}
                className="w-[50%] py-3 lg:py-1.5 rounded-[13px] bg-twilight text-white text-2xl lg:text-lg text-hornbill font-hornbill"
              >
                Split
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

export default ItemList;