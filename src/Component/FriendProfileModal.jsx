import { useState, useEffect } from "react";
import { UserPlus, UserMinus } from "lucide-react";
import { addFriend, checkFriendshipStatus } from "../utils/friendUtils";

const FriendProfileModal = ({ friend, onClose, onFriendAdded }) => {
  const [isFriend, setIsFriend] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // Check friendship status when component mounts
  useEffect(() => {
    const checkStatus = async () => {
      const { isFriend: isAlreadyFriend } = await checkFriendshipStatus(
        friend.id
      );
      setIsFriend(isAlreadyFriend);
    };

    if (friend?.id) {
      checkStatus();
    }
  }, [friend?.id]);

  // Handle adding a friend
  const handleAddFriend = async () => {
    if (isAdding) return;

    setIsAdding(true);

    try {
      const result = await addFriend(friend.username);

      if (result.success) {
        setIsFriend(true);

        if (onFriendAdded) {
          onFriendAdded(friend.id);
        }
      } else {
        console.error("Failed to add friend:", result.message);
      }
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
          
        </div>

        {/* Profile Info */}
        <div className="flex flex-col items-center">
          <img
            src={friend.avatarUrl}
            alt={friend.name}
            className="w-24 h-24 rounded-full mb-4"
          />
          <h1 className="!text-4xl text-twilight font-dream">
            {friend.name}
          </h1>
          <p className="text-[20px] font-telegraf text-twilight mb-6">
            @{friend.username}
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
                value={friend.bio || "No bio available"}
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
