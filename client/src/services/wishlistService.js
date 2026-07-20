import axiosInstance from './axiosInstance.js';

const API_URL = '/wishlist/';

const getWishlist = async () => {
  const response = await axiosInstance.get(API_URL, { withCredentials: true });
  return response.data;
};

const addToWishlist = async (productId) => {
  const response = await axiosInstance.post(API_URL + 'add', { productId }, { withCredentials: true });
  return response.data;
};

const removeFromWishlist = async (productId) => {
  const response = await axiosInstance.delete(`${API_URL}remove/${productId}`, { withCredentials: true });
  return response.data;
};

const wishlistService = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};

export default wishlistService;
