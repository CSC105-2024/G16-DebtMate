import { useNavigate } from "react-router-dom";

function UserInformation() {
  const navigate = useNavigate();

  const user = {
    profilePicture: "/assets/icons/imgtemp.png",
    name: "Mike Wazowski",
    username: "mike_020",
    email: "mike020@gmail.com",
    bio: "Write something about you here. Okay?",
  };

  return (
    <div className="flex flex-col items-center bg-color-dreamy min-h-screen p-4 relative">
      {/* Top Buttons */}
      <div className="w-full flex justify-between items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-twilight text-[24px] font-hornbill"
        >
          &lt; Back
        </button>
        <button
          onClick={() => navigate("/user-info-edit")}
          className="text-twilight text-[24px] font-hornbill"
        >
          Edit
        </button>
      </div>

      {/* Profile Section */}
      <img
        src={user.profilePicture}
        alt="Profile"
        className="w-24 h-24 rounded-full mb-4"
      />
      <h1 className="text-2xl font-hornbill text-twilight font-bold">
        {user.name}
      </h1>
      <p className="text-[20px] font-telegraf text-twilight mb-6">
        @{user.username}
      </p>

      {/* User Info Section */}
      <div className="w-full max-w-md space-y-4">
        <div>
          <label className="block text-twilight font-semibold mb-1 text-left font-hornbill text-[24px]">
            Email
          </label>
          <input
            type="text"
            value={user.email}
            readOnly
            className="text-twilight w-full p-2 rounded-[13px] border border-twilight bg-transparent"
          />
        </div>
        <div>
          <label className="block text-twilight font-semibold mb-1 text-left font-hornbill text-[24px]">
            Bio
          </label>
          <textarea
            value={user.bio}
            readOnly
            className="text-twilight w-full p-2 rounded-[13px] border border-twilight bg-transparent resize-none"
            rows={4}
          />
        </div>
      </div>
    </div>
  );
}

export default UserInformation;
