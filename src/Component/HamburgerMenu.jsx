import { useState } from "react";

export default function HamburgerMenu({ isOpen, setIsOpen }) {
  return (
    <>
      {/*Close the sidebar if the 'outside' is clicked*/}
      {isOpen && (
        <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
      )}

      <div
        className={`fixed top-0 left-0 h-full w-[70%] max-w-xs bg-white z-40 shadow-lg transition-transform duration-500 rounded-tr-4xl ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* sidebar content here */}
        <div className="p-3 pt-0">
          <h2 className="font-hornbill mb-[6vh] font-black text-[50px] text-twilight mt-[2vh] mb-[3vh] ">
            Debt Mate
          </h2>
        </div>
      </div>
    </>
  );
}
