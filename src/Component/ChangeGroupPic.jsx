import React from "react";
import { useState } from "react";

import group1 from "/assets/icons/group1.svg";
import group2 from "/assets/icons/group2.svg";
import group3 from "/assets/icons/group3.svg";
import group4 from "/assets/icons/group4.svg";
import group5 from "/assets/icons/group5.svg";
import group6 from "/assets/icons/group6.svg";
import group7 from "/assets/icons/group7.svg";
import group8 from "/assets/icons/group8.svg";
import group9 from "/assets/icons/group9.svg";

function ChangeGroupPic({ onClose, onConfirm }) {
  const [selected, setSelected] = useState(null);

  const pictures = [group1, group2, group3, group4, group5, group6, group7, group8, group9];

  const handleSelect = (index) => {
    setSelected(index);
  };

  const handleConfirm = () => {
    if (selected !== null) {
      onConfirm(pictures[selected]);
    }
    onClose();
  };

  return (
    <div className="flex flex-col items-center p-4">
      {/* Grid Container */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {pictures.map((pic, index) => (
          <div
            key={index}
            className={`w-20 h-20 rounded-full overflow-hidden cursor-pointer border-4 ${
              selected === index ? "border-blue-400" : "border-transparent"
            }`}
            onClick={() => handleSelect(index)}
          >
            <img
              src={pic}
              alt={`Option ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}

        {/* Plus Button */}
        <div
          className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer text-3xl font-bold text-twilight"
          onClick={() => alert("Upload new picture")}
        >
          +
        </div>
      </div>

      {/* Confirm Button */}
      <button
        onClick={handleConfirm}
        className="bg-twilight text-icy py-2 px-6 rounded-[13px] shadow-md hover:bg-dreamy active:scale-95 font-bold font-hornbill"
      >
        Confirm
      </button>
    </div>
  );
}

export default ChangeGroupPic;