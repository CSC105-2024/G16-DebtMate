import axios from "axios";
import defaultprofile from "/assets/icons/defaultprofile.png";

/**
 * Search for users by query string
 * @param {string} searchTerm - The search query
 * @param {boolean} fetchAll - Whether to fetch all available users
 * @returns {Promise<{success: boolean, results: Array, error: string|null}>}
 */
export const searchUsers = async (searchTerm, fetchAll = false) => {
  try {
    if (!fetchAll && (!searchTerm || searchTerm.trim().length === 0)) {
      return { success: true, results: [], error: null };
    }

    const queryParam = fetchAll ? 'all=true' : `query=${encodeURIComponent(searchTerm.trim())}`;
    
    const response = await axios.get(
      `http://localhost:3000/api/users/friends/search?${queryParam}`,
      {
        withCredentials: true,
      }
    );

    const data = response.data;

    if (data.success) {
      const formattedResults = data.users.map((user) => ({
        id: user.id,
        name: user.name || user.username,
        username: user.username,
        email: user.email,
        balance: 0,
        avatarUrl: user.avatarUrl || defaultprofile,
      }));

      return { success: true, results: formattedResults, error: null };
    } else {
      return { success: false, results: [], error: data.message || "Search failed" };
    }
  } catch (err) {
    console.error("Search users error:", err);
    return { success: false, results: [], error: "Network error during search" };
  }
};

/**
 * Filter an array using a search term
 * @param {Array} items - The array to filter
 * @param {string} searchTerm - The search term
 * @param {Array<string>} fields - Fields to search in (e.g., ['name', 'username'])
 * @returns {Array} - Filtered array
 */
export const filterBySearchTerm = (
  items,
  searchTerm,
  fields = ["name", "username"]
) => {
  if (!searchTerm || searchTerm.trim() === "") {
    return items;
  }

  const term = searchTerm.toLowerCase().trim();

  return items.filter((item) => {
    return fields.some((field) => {
      return item[field] && item[field].toLowerCase().includes(term);
    });
  });
};
