import Avatar from "./Avatar";
import { getAvatarUrl } from "../utils/avatarUtils";

const GroupCard = ({ name, balance, avatarUrl, icon, onClick }) => {
  return (
    <div
      className="md:w-[390px] sm:w-[145px] h-[71px] rounded-[13px] border border-twilight bg-backg hover:bg-gray-500 hover:shadow-lg hover:backdrop-blur-[18px] transition-all duration-300 p-[13px] box-border flex items-center justify-between cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center gap-3 overflow-hidden flex-1 min-w-0">
        <Avatar
          src={getAvatarUrl({ icon, avatarUrl }, "group")}
          alt={name}
        />
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
          ? `+$${Number(balance).toFixed(2)}`
          : balance < 0
          ? `-$${Math.abs(Number(balance)).toFixed(2)}`
          : "$0.00"}
      </div>
    </div>
  );
};

export default GroupCard;
