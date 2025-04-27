import React from "react";
import { useState } from "react";

import user1 from "/assets/icons/user1.svg";
import user2 from "/assets/icons/user2.svg";
import user3 from "/assets/icons/user3.svg";
import user4 from "/assets/icons/user4.svg";
import user5 from "/assets/icons/user5.svg";
import user6 from "/assets/icons/user6.svg";
import user7 from "/assets/icons/user7.svg";
import user8 from "/assets/icons/user8.svg";
import user9 from "/assets/icons/user9.svg";

function ChangePicture({ onClose, onConfirm }) {
  const [selected, setSelected] = useState(null);

  const pictures = [user1, user2, user3, user4, user5, user6, user7, user8, user9];

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

export default ChangePicture;