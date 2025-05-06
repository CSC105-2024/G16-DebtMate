import { useState } from "react";
import { UserPlus, UserMinus } from "lucide-react";

const FriendProfileModal = ({ friend, onClose, onFriendAdded }) => {
  const [isFriend, setIsFriend] = useState(false); // Track friend state
  const [isAdding, setIsAdding] = useState(false); // Track adding state

  // Handle adding a friend
  const handleAddFriend = async () => {
    setIsAdding(true);

    try {
      const response = await fetch("http://localhost:3000/api/users/friends", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ friendUsername: friend.username }),
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        setIsFriend(true);

        if (onFriendAdded) {
          onFriendAdded(friend.id);
        }
      } else {
        console.error("Failed to add friend:", data.message);
      }
    } catch (err) {
      console.error("Add friend error:", err);
    } finally {
      setIsAdding(false);
    }
  };

  if (!friend) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-pale rounded-[13px] p-6 w-full max-w-md relative">
        {/* Top Buttons */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={onClose}
            className="text-twilight text-[24px] font-hornbill"
          >
            &lt; Back
          </button>
          <button
            onClick={() => (isFriend ? setIsFriend(false) : handleAddFriend())}
            className="p-2 rounded-full hover:bg-slate-300 transition"
            disabled={isAdding}
          >
            {isFriend ? (
              <UserMinus className="text-twilight w-6 h-6" />
            ) : (
              <UserPlus className="text-twilight w-6 h-6" />
            )}
          </button>
        </div>

        {/* Profile Info */}
        <div className="flex flex-col items-center">
          <img
            src={friend.avatarUrl}
            alt={friend.name}
            className="w-24 h-24 rounded-full mb-4"
          />
          <h1 className="text-2xl font-hornbill text-twilight font-bold">
            {friend.name}
          </h1>
          <p className="text-[20px] font-telegraf text-twilight mb-6">
            @{friend.email}
          </p>
          <p
            className={`font-telegraf font-black text-[30px] min-w-[70px] text-center ${
              friend.balance > 0
                ? "text-twilight"
                : friend.balance < 0
                ? "text-dreamy"
                : "text-paid"
            }`}
          >
            {friend.balance}
          </p>

          <div className="w-full space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-twilight font-hornbill text-[24px] mb-1 text-left">
                Email
              </label>
              <input
                type="text"
                value={friend.email}
                readOnly
                className="text-twilight w-full p-2 rounded-[13px] border border-twilight bg-transparent"
              />
            </div>

            {/* Bio Field */}
            <div>
              <label className="block text-twilight font-hornbill text-[24px] mb-1 text-left">
                Bio
              </label>
              <textarea
                value={friend.bio}
                readOnly
                className="text-twilight w-full p-2 rounded-[13px] border border-twilight bg-transparent resize-none"
                rows={4}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendProfileModal;
