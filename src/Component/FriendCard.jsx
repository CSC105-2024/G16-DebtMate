import React, { useState, useEffect } from 'react';
import Avatar from "./Avatar";
import { getFriendBalance } from '../utils/balanceUtils';

const FriendCard = ({ name, balance: initialBalance, avatarUrl, onClick, className = "", userId }) => {
  const currency = localStorage.getItem("currency") || "$";
  const [balance, setBalance] = useState(initialBalance || 0);

  useEffect(() => {
    // If userId is provided, fetch the balance
    const fetchBalance = async () => {
      if (!userId) return;
      
      try {
        const fetchedBalance = await getFriendBalance(userId);
        setBalance(fetchedBalance);
      } catch (err) {
        console.error('Error fetching friend balance:', err);
      }
    };
    
    if (userId) {
      fetchBalance();
    }
  }, [userId]); 

  const handleClick = () => {
    if (onClick && typeof onClick === "function") {
      onClick({ name, balance, avatarUrl });
    }
  };

  return (
    <div
      className={`w-[324px] md:w-[390px] h-[71px] rounded-[13px] border border-twilight bg-backg hover:bg-gray-200 hover:shadow-lg hover:backdrop-blur-[18px] transition-all duration-300 p-[13px] box-border flex items-center justify-between ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
      onClick={handleClick}
    >
      <div className="flex items-center gap-3 overflow-hidden flex-1 min-w-0">
        <Avatar src={avatarUrl} alt={name} />
        <span className="font-dream font-extrabold text-[20px] text-twilight truncate">
          {name}
        </span>
      </div>

      <div
        className={`font-telegraf font-black text-[20px] min-w-[70px] text-right ${
          balance > 0
            ? "text-twilight"
            : balance < 0
            ? "text-dreamy"
            : "text-paid"
        }`}
      >
        {balance > 0
          ? `+${currency} ${Number(balance).toFixed(2)}`
          : balance < 0
          ? `-${currency} ${Math.abs(Number(balance)).toFixed(2)}`
          : `${currency} 0.00`}
      </div>
    </div>
  );
};

export default FriendCard;
