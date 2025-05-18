import axios from "axios";
import { string } from "prop-types";

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

export const fetchUserFriends = async (userId) => {

      try {
        const friendsResponse = await axios.get(
          `http://localhost:3000/api/users/${userId}/friends`,
          {
            withCredentials: true,
          }
        );

        if (friendsResponse.data && friendsResponse.data.success) {
          return friendsResponse.data.friends.map(
            (friend) => ({
              id: friend.id,
              name: friend.name || friend.username,
              avatarUrl: friend.avatarUrl || defaultprofile,
              username: friend.username,
            })
          );
        } else {
          console.error("Failed to fetch friends:", friendsResponse.data);
        }
      } catch (err) {
        console.error("Error fetching friends:", err);
      }
    };