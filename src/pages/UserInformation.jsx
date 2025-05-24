import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

function UserInformation() {
  const navigate = useNavigate();
  const { updateUser } = useAuth();
  const [userData, setUserData] = useState({
    profilePicture: "/assets/icons/imgtemp.png",
    name: "",
    username: "",
    email: "",
    bio: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:3000/api/users/me",
          { withCredentials: true }
        );

        if (response.data.success) {
          updateUser(response.data.user);

          setUserData({
            profilePicture:
              response.data.user.avatar || "/assets/icons/imgtemp.png",
            name: response.data.user.name || "",
            username: response.data.user.username || "",
            email: response.data.user.email || "",
            bio: response.data.user.bio || "",
          });
          setError("");
        } else {
          setError("Could not load user information");
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load your profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="flex flex-col items-center bg-color-dreamy min-h-screen p-4 relative">
      {/* Top Buttons */}
      <div className="w-full flex justify-between items-center mb-6">
        <button
          onClick={() => navigate(-2)}
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

      {loading ? (
        <div className="flex items-center justify-center h-52">
          <p className="text-twilight text-lg">Loading your profile...</p>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-52">
          <p className="text-red-500">{error}</p>
        </div>
      ) : (
        <>
          {/* Profile Section */}
          <img
            src={userData.profilePicture}
            alt="Profile"
            className="w-24 h-24 rounded-full mb-4 object-cover"
          />
          <h1 className="!text-4xl  text-twilight font-bold">
            {userData.name}
          </h1>
          <p className="text-[20px] font-telegraf text-twilight mb-6">
            @{userData.username}
          </p>

          {/* User Info Section */}
          <div className="w-full max-w-md space-y-4">
            <div>
              <label className="block text-twilight font-semibold mb-1 text-left font-hornbill text-[24px]">
                Email
              </label>
              <input
                type="text"
                value={userData.email}
                readOnly
                className="text-twilight w-full p-2 rounded-[13px] border border-twilight bg-transparent"
              />
            </div>
            <div>
              <label className="block text-twilight font-semibold mb-1 text-left font-hornbill text-[24px]">
                Bio
              </label>
              <textarea
                value={userData.bio}
                readOnly
                className="text-twilight w-full p-2 rounded-[13px] border border-twilight bg-transparent resize-none"
                rows={4}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default UserInformation;
