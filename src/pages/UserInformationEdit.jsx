import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ChangePicture from "../Component/ChangePicture";
import { useAuth } from "../context/AuthContext";
import { z } from "zod";
import axios from "axios"; 

export default function UserInformationEdit() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isChangePictureOpen, setIsChangePictureOpen] = useState(false);
  const [profilePicture, setProfilePicture] = useState("/assets/icons/imgtemp.png");

  const [userInfo, setUserInfo] = useState({
    name: user?.name || "",
    username: user?.username || "",
    email: user?.email || "",
    bio: user?.bio || "",
    currentPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    if (user) {
      setUserInfo({
        name: user.name || "",
        username: user.username || "",
        email: user.email || "",
        bio: user.bio || "",
        currentPassword: "",
        newPassword: "",
      });
      setProfilePicture(user.avatarUrl || user.avatar || "/assets/icons/imgtemp.png");
    }
  }, [user]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3000/api/users/me', 
          { withCredentials: true }
        );
        
        if (response.data.success) {
          updateUser(response.data.user);
          
          setUserInfo({
            name: response.data.user.name || "",
            username: response.data.user.username || "",
            email: response.data.user.email || "",
            bio: response.data.user.bio || "",
            currentPassword: "",
            newPassword: "",
          });
          
          setProfilePicture(response.data.user.avatarUrl || response.data.user.avatar || "/assets/icons/imgtemp.png");
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load your profile data. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []); 

  const userUpdateSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    bio: z.string().optional(),
    currentPassword: z.string().optional(),
    newPassword: z.string().optional(),
  });

  const passwordUpdateSchema = z.object({
    currentPassword: z.string().min(6, "Current password is required"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleConfirm = async () => {
    try {
      setLoading(true);
      setError("");
      
      try {
        userUpdateSchema.parse(userInfo);
      } catch (validationError) {
        setError(validationError.errors[0].message);
        setLoading(false);
        return;
      }

      const updateData = {
        name: userInfo.name,
        bio: userInfo.bio,
        avatar: profilePicture, 
      };

      if (userInfo.currentPassword && userInfo.newPassword) {
        try {
          passwordUpdateSchema.parse({
            currentPassword: userInfo.currentPassword,
            newPassword: userInfo.newPassword,
          });
          updateData.currentPassword = userInfo.currentPassword;
          updateData.newPassword = userInfo.newPassword;
        } catch (validationError) {
          setError(validationError.errors[0].message);
          setLoading(false);
          return;
        }
      }

      const response = await axios.put('http://localhost:3000/api/users/me', 
        updateData, 
        { withCredentials: true }
      );
      
      if (response.data.success) {
        updateUser({
          ...user,
          name: userInfo.name,
          bio: userInfo.bio,
          avatar: profilePicture,
        });
        
        setSuccess("Profile updated successfully!");
        setTimeout(() => navigate("/user-info", { replace: true }), 1000);
      } else {
        setError(response.data.message || "Failed to update profile");
      }
    } catch (err) {
      console.error("Update profile error:", err);
      if (err.response && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Network error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
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
          disabled={loading}
          className="text-twilight text-[24px] font-hornbill disabled:opacity-50"
        >
          {loading ? "Saving..." : "Confirm"}
        </button>
      </div>

      {/* Profile Section */}
      <div
        className="w-24 h-24 rounded-full overflow-hidden mb-4 cursor-pointer"
        onClick={() => setIsChangePictureOpen(true)}
      >
        <img
          src={profilePicture}
          alt="Profile"
          className="w-full h-full object-cover"
        />
      </div>

      <h1 className="!text-4xl text-twilight font-dream mb-2 mixed-fonts">
        {userInfo.name}
      </h1>
      <p className="text-[20px] font-telegraf text-twilight mb-6">@{userInfo.username}</p>

      {/* Error/Success Messages */}
      {error && <p className="text-red-500 text-sm mb-4 w-full max-w-md text-center">{error}</p>}
      {success && <p className="text-green-500 text-sm mb-4 w-full max-w-md text-center">{success}</p>}

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
            readOnly
            disabled
            className="text-twilight w-full p-2 rounded-[13px] border border-twilight bg-transparent opacity-70"
          />
          <p className="text-xs text-twilight mt-1">Username cannot be changed</p>
        </div>
        <div>
          <label className="block text-twilight font-semibold mb-1 text-left font-hornbill text-[24px]">Email</label>
          <input
            type="email"
            name="email"
            value={userInfo.email}
            readOnly
            disabled
            className="text-twilight w-full p-2 rounded-[13px] border border-twilight bg-transparent opacity-70"
          />
          <p className="text-xs text-twilight mt-1">Email cannot be changed</p>
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
        <div className="pt-4 border-t border-twilight">
          <h3 className="font-hornbill text-twilight text-xl mb-3">Change Password</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-twilight font-semibold mb-1 text-left font-hornbill text-[20px]">Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={userInfo.currentPassword}
                onChange={handleChange}
                className="text-twilight w-full p-2 rounded-[13px] border border-twilight bg-transparent"
              />
            </div>
            <div>
              <label className="block text-twilight font-semibold mb-1 text-left font-hornbill text-[20px]">New Password</label>
              <input
                type="password"
                name="newPassword"
                value={userInfo.newPassword}
                onChange={handleChange}
                className="text-twilight w-full p-2 rounded-[13px] border border-twilight bg-transparent"
              />
              <p className="text-xs text-twilight mt-1">Leave both password fields empty if you don't want to change your password</p>
            </div>
          </div>
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
