import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ChangePicture from "../Component/ChangePicture";

export default function UserInformationEdit() {
  const navigate = useNavigate();

  const [isChangePictureOpen, setIsChangePictureOpen] = useState(false);

  const [profilePicture, setProfilePicture] = useState("/assets/icons/imgtemp.png");

  const [userInfo, setUserInfo] = useState({
    name: "Mike Wazowski",
    username: "mike_020",
    email: "mike020@gmail.com",
    bio: "Write something about you here. Okay?",
    currentPassword: "",
    newPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleConfirm = () => {
    navigate("/user-info");
  };

  return (
    <div className="flex flex-col items-center bg-color-dreamy min-h-screen p-6 relative">
      {/* Top Buttons */}
      <div className="w-full flex justify-between items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-twilight text-[24px] font-hornbill"
        >
          &lt; Back
        </button>
        <button
          onClick={handleConfirm}
          className="text-twilight text-[24px] font-hornbill"
        >
          Confirm
        </button>
      </div>

      {/* Profile Section */}
      <div
        className="w-24 h-24 rounded-full overflow-hidden mb-4 cursor-pointer"
        onClick={() => setIsChangePictureOpen(true)}
      >
        <img
          src="/assets/icons/imgtemp.png"
          alt="Profile"
          className="w-full h-full object-cover"
        />
      </div>

      <h1 className="text-2xl font-hornbill text-twilight font-bold mb-2">
        {userInfo.name}
      </h1>
      <p className="text-[20px] font-telegraf text-twilight mb-6">@{userInfo.username}</p>

      {/* User Info Section */}
      <div className="w-full max-w-md space-y-4">
        <div>
          <label className="block text-twilight font-semibold mb-1 text-left font-hornbill text-[24px]">Name</label>
          <input
            type="text"
            name="name"
            value={userInfo.name}
            onChange={handleChange}
            className="text-twilight w-full p-2 rounded-[13px] border border-twilight bg-transparent"
          />
        </div>
        <div>
          <label className="block text-twilight font-semibold mb-1 text-left font-hornbill text-[24px]">Username</label>
          <input
            type="text"
            name="username"
            value={userInfo.username}
            onChange={handleChange}
            className="text-twilight w-full p-2 rounded-[13px] border border-twilight bg-transparent"
          />
        </div>
        <div>
          <label className="block text-twilight font-semibold mb-1 text-left font-hornbill text-[24px]">Email</label>
          <input
            type="email"
            name="email"
            value={userInfo.email}
            onChange={handleChange}
            className="text-twilight w-full p-2 rounded-[13px] border border-twilight bg-transparent"
          />
        </div>
        <div>
          <label className="block text-twilight font-semibold mb-1 text-left font-hornbill text-[24px]">Bio</label>
          <textarea
            name="bio"
            value={userInfo.bio}
            onChange={handleChange}
            className="text-twilight w-full p-2 rounded-[13px] border border-twilight bg-transparent resize-none"
            rows={4}
          />
        </div>
        <div>
          <label className="block text-twilight font-semibold mb-1 text-left font-hornbill text-[24px]">Current Password</label>
          <input
            type="password"
            name="currentPassword"
            value={userInfo.currentPassword}
            onChange={handleChange}
            className="text-twilight w-full p-2 rounded-[13px] border border-twilight bg-transparent"
          />
        </div>
        <div>
          <label className="block text-twilight font-semibold mb-1 text-left font-hornbill text-[24px]">New Password</label>
          <input
            type="password"
            name="newPassword"
            value={userInfo.newPassword}
            onChange={handleChange}
            className="text-twilight w-full p-2 rounded-[13px] border border-twilight bg-transparent"
          />
        </div>
      </div>

      {/* Change Picture Modal */}
        {isChangePictureOpen && (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setIsChangePictureOpen(false)}
        >
            <div
                className="bg-white rounded-[20px] p-6 z-60"
                onClick={(e) => e.stopPropagation()}
            >
                <ChangePicture 
                onClose={() => setIsChangePictureOpen(false)}
                onConfirm={(newPicture) => {
                setProfilePicture(newPicture);
                setIsChangePictureOpen(false);
                }}
            />
        </div>
  </div>
)}



    </div>
  );
}
