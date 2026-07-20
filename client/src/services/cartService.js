import axiosInstance from './axiosInstance.js';

const API_URL = '/cart/';

const getCart = async () => {
  const response = await axiosInstance.get(API_URL, { withCredentials: true });
  return response.data;
};

const addToCart = async (cartData) => {
  const response = await axiosInstance.post(API_URL + 'add', cartData, { withCredentials: true });
  return response.data;
};

const updateQuantity = async (productId, quantity) => {
  const response = await axiosInstance.put(`${API_URL}update/${productId}`, { quantity }, { withCredentials: true });
  return response.data;
};

const removeProduct = async (productId) => {
  const response = await axiosInstance.delete(`${API_URL}remove/${productId}`, { withCredentials: true });
  return response.data;
};

const clearCart = async () => {
  const response = await axiosInstance.delete(`${API_URL}clear`, { withCredentials: true });
  return response.data;
};

const cartService = {
  getCart,
  addToCart,
  updateQuantity,
  removeProduct,
  clearCart,
};

export default cartService;
