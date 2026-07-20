import axios from 'axios';

const API_URL = '/api/cart/';

const getCart = async () => {
  const response = await axios.get(API_URL, { withCredentials: true });
  return response.data;
};

const addToCart = async (cartData) => {
  const response = await axios.post(API_URL + 'add', cartData, { withCredentials: true });
  return response.data;
};

const updateQuantity = async (productId, quantity) => {
  const response = await axios.put(`${API_URL}update/${productId}`, { quantity }, { withCredentials: true });
  return response.data;
};

const removeProduct = async (productId) => {
  const response = await axios.delete(`${API_URL}remove/${productId}`, { withCredentials: true });
  return response.data;
};

const clearCart = async () => {
  const response = await axios.delete(`${API_URL}clear`, { withCredentials: true });
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
