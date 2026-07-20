import axios from 'axios';

const API_URL = '/api/wishlist/';

const getWishlist = async () => {
  const response = await axios.get(API_URL, { withCredentials: true });
  return response.data;
};

const addToWishlist = async (productId) => {
  const response = await axios.post(API_URL + 'add', { productId }, { withCredentials: true });
  return response.data;
};

const removeFromWishlist = async (productId) => {
  const response = await axios.delete(`${API_URL}remove/${productId}`, { withCredentials: true });
  return response.data;
};

const wishlistService = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};

export default wishlistService;
