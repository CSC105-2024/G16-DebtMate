import axios from "axios";
import defaultprofile from "/assets/icons/defaultprofile.png";

/**
 * Add a friend by their username
 * @param {string} friendUsername - Username of the friend to add
 * @returns {Promise<{success: boolean, message: string|null}>}
 */
export const addFriend = async (friendUsername) => {
  try {
    const response = await axios.post(
      "http://localhost:3000/api/users/friends",
      { friendUsername },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    const data = response.data;

    return {
      success: data.success,
      message: data.message || null,
    };
  } catch (err) {
    console.error("Add friend error:", err);
    return {
      success: false,
      message: "Network error while adding friend",
    };
  }
};

/**
 * Check if a user is already your friend
 * @param {number} userId - ID of the user to check
 * @returns {Promise<{isFriend: boolean, error: string|null}>}
 */
export const checkFriendshipStatus = async (userId) => {
  try {
    // Get current user info
    const meResponse = await axios.get("http://localhost:3000/api/users/me", {
      withCredentials: true,
    });
    const meData = meResponse.data;

    if (!meData.success) {
      return { isFriend: false, error: "Failed to fetch user data" };
    }

    // Get friend list
    const friendsResponse = await axios.get(
      `http://localhost:3000/api/users/${meData.user.id}/friends`,
      {
        withCredentials: true,
      }
    );

    const friendsData = friendsResponse.data;

    if (!friendsData.success) {
      return { isFriend: false, error: "Failed to fetch friends list" };
    }

    // Check if user is in friend list
    const isFriend = friendsData.friends.some((friend) => friend.id === userId);

    return { isFriend, error: null };
  } catch (err) {
    console.error("Check friendship status error:", err);
    return { isFriend: false, error: "Network error" };
  }
};

/**
 * Get the currently authenticated user
 * @returns {Promise<{user: Object|null, error: string|null}>}
 */
export const getCurrentUser = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/users/me", {
      withCredentials: true,
    });
    const data = response.data;

    if (data.success) {
      return { user: data.user, error: null };
    }

    return { user: null, error: data.message || "Failed to fetch user" };
  } catch (err) {
    console.error("Get current user error:", err);
    return { user: null, error: "Network error" };
  }
};
