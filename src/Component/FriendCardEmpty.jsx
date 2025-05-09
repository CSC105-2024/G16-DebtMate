import Avatar from "./Avatar";

const FriendCardEmpty = ({ name, avatarUrl, onClick, className = "" }) => {
  const handleClick = () => {
    if (onClick) {
      onClick({ name, avatarUrl });
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
        <span className="font-telegraf font-extrabold text-[20px] text-twilight truncate">
          {name}
        </span>
      </div>
    </div>
  );
};

export default FriendCardEmpty;
