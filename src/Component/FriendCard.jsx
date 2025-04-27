import Avatar from "./Avatar";

const FriendCard = ({ name, balance, avatarUrl, onClick, className = "" }) => {
  // Get currency from localStorage, default to "$" if none
  const currency = localStorage.getItem("currency") || "$";

  return (
    <div
      className={`w-[324px] md:w-[390px] h-[71px] rounded-[13px] border border-twilight bg-backg hover:bg-gray-200 hover:shadow-lg hover:backdrop-blur-[18px] transition-all duration-300 p-[13px] box-border flex items-center justify-between cursor-pointer ${className}`}
      onClick={() => onClick({name, balance, avatarUrl})}
    >
      <div className="flex items-center gap-3 overflow-hidden flex-1 min-w-0">
        <Avatar src={avatarUrl} alt={name} />
        <span className="font-telegraf font-extrabold text-[20px] text-twilight truncate">
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
          ? `+${currency} ${balance}`
          : balance < 0
          ? `-${currency} ${Math.abs(balance)}`
          : `${currency} 0`}
      </div>
    </div>
  );
};

export default FriendCard;
