import React from "react";

const ItemCard = React.memo(function ItemCard({ item, currency, onClick }) {
  return (
    <div
      className="rounded-[13px] border border-twilight bg-backg py-6 px-4 flex justify-between items-center cursor-pointer hover:bg-gray-100"
      onClick={onClick}
    >
      <span className="font-telegraf  text-2xl font-semibold text-twilight">
        {item.name}
      </span>
      <span className="font-telegraf text-2xl font-bold text-twilight">
        {currency} {parseFloat(item.amount).toFixed(2)}
      </span>
    </div>
  );
});

export default ItemCard;
