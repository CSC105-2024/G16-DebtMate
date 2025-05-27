import axios from 'axios';

export const getFriendBalance = async (friendId) => {
  try {
    const response = await axios.get(`/api/users/me/friends/${friendId}/balance`, {
      withCredentials: true,
    });
    
    if (response.data && response.data.success) {
      return response.data.balance;
    }
    
    return 0;
  } catch (err) {
    console.error('Error fetching friend balance:', err);
    return 0;
  }
};