import defaultprofile from "/assets/icons/defaultprofile.png";

/**
 * Search for users by query string
 * @param {string} searchTerm - The search query
 * @returns {Promise<{success: boolean, results: Array, error: string|null}>}
 */
export const searchUsers = async (searchTerm) => {
  try {
    if (!searchTerm || searchTerm.trim().length === 0) {
      return { success: true, results: [], error: null };
    }

    const response = await fetch(
      `http://localhost:3000/api/users/friends/search?query=${encodeURIComponent(
        searchTerm.trim()
      )}`,
      {
        credentials: "include",
      }
    );

    const data = await response.json();

    if (data.success) {
      // Format the results for display
      const formattedResults = data.users.map((user) => ({
        id: user.id,
        name: user.name || user.username,
        username: user.username,
        email: user.email,
        balance: 0,
        avatarUrl: user.avatarUrl || defaultprofile,
        bio: user.bio || "",
      }));

      return { success: true, results: formattedResults, error: null };
    }

    return {
      success: false,
      results: [],
      error: data.message || "Search failed",
    };
  } catch (error) {
    console.error("Search error:", error);
    return {
      success: false,
      results: [],
      error: "Network error while searching",
    };
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
