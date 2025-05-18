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