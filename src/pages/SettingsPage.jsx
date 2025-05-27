import React, { useState, useEffect } from "react";
import HamburgerMenu from "../Component/HamburgerMenu";
import {
  Menu,
  DollarSign,
  RefreshCcw,
  MessageSquare,
  Info,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import CurrencySelect from "../Component/CurrencySelect";
import { useAuth } from "../context/AuthContext";

function SettingsPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const navigate = useNavigate();
  const [isCurrencyModalOpen, setIsCurrencyModalOpen] = useState(false);
  const [currency, setCurrency] = useState("USD");
  const { logout } = useAuth();

  const menuWidth = "w-72";

  // Currency code to symbol mapping
  const currencySymbols = {
    THB: "฿",
    USD: "$",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
    INR: "₹",
  };

  // Function to convert currency code to symbol
  const getCurrencySymbol = (code) => {
    return currencySymbols[code] || code;
  };

  useEffect(() => {
    const checkScreenSize = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      setIsMenuOpen(desktop); // Auto-open on desktop
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    const savedCurrency = localStorage.getItem("currency");
    if (savedCurrency) {
      setCurrency(savedCurrency);
    }
  }, []);

  const settingsOptions = [
    { label: "Currency", icon: DollarSign },
    { label: "Refresh", icon: RefreshCcw },
    { label: "Feedback", icon: MessageSquare },
    { label: "About", icon: Info },
    { label: "Logout", icon: LogOut },
  ];

  const handleClick = async (type) => {
    if (type === "Currency") {
      setIsCurrencyModalOpen(true);
    } else if(type == "Refresh"){
      window.location.reload();
    }else if (type === "Logout") {
      try {
        await logout();
        navigate("/");
      } catch (error) {
        console.error("Logout error:", error);
        navigate("/");
      }
    }
  };

  return (
    <div className="flex bg-color-dreamy h-screen overflow-hidden">
      {/* Sidebar */}
      {isDesktop ? (
        <div className={`fixed inset-y-0 left-0 z-50 ${menuWidth}`}>
          <HamburgerMenu isOpen={true} setIsOpen={setIsMenuOpen} />
        </div>
      ) : (
        <div
          className={`fixed inset-y-0 left-0 z-50 ${menuWidth} transform transition-transform duration-300 ease-in-out ${
            isMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <HamburgerMenu isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />
        </div>
      )}

      {/* Main Content */}
      <div className={`flex-1 flex flex-col ${isDesktop ? "ml-72" : ""}`}>
        {/* Sticky Header */}
        <div className="sticky top-0 z-30 bg-color-dreamy px-4 pt-4 pb-2">
          <div className="flex items-center justify-center gap-3">
            {!isDesktop && (
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-3 border border-twilight rounded-md"
              >
                <Menu className="w-5 h-5 text-black" />
              </button>
            )}
            <h1 className="text-2xl font-hornbill text-twilight">Settings</h1>
          </div>
        </div>

        {/* Settings Options */}
        <div className="flex-1 overflow-y-auto px-6 pt-6 pb-10">
          {/* Mobile layout */}
          <div className="w-full max-w-md mx-auto grid grid-cols-2 gap-4 lg:hidden">
            {settingsOptions.map((option, index) => (
              <button
                key={index}
                className="flex flex-col items-center justify-center aspect-square border-2 border-twilight rounded-xl hover:bg-slate-200 transition bg-color-dreamy"
                onClick={() => handleClick(option.label)}
              >
                <option.icon className="w-8 h-8 text-twilight" />
                <span className="mt-2 font-bold text-twilight text-sm">
                  {option.label}{" "}
                </span>
              </button>
            ))}
          </div>

          {/* Desktop layout */}
          <div className="hidden lg:grid grid-cols-2 gap-6 w-full max-w-4xl mx-auto pt-4">
            {settingsOptions.map((option, index) => (
              <button
                key={index}
                className="flex flex-col items-center justify-center p-6 border-2 border-twilight rounded-xl hover:bg-slate-200 transition bg-color-dreamy cursor-pointer"
                onClick={() => handleClick(option.label)}
              >
                <option.icon className="w-8 h-8 text-twilight" />
                <span className="mt-3 font-bold text-twilight">
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Overlay for Mobile */}
      {!isDesktop && isMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      <CurrencySelect
        open={isCurrencyModalOpen}
        onClose={() => setIsCurrencyModalOpen(false)}
        onSelect={(selectedCurrency) => {
          const currencySymbol = getCurrencySymbol(selectedCurrency);
          setCurrency(selectedCurrency);
          console.log("Selected:", selectedCurrency, "Symbol:", currencySymbol);
          localStorage.setItem("currency", currencySymbol);
        }}
      />
    </div>
  );
}

export default SettingsPage;