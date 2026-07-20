import axiosInstance from './axiosInstance.js';

const API_URL = '/orders/';

const createOrder = async (orderData) => {
  const response = await axiosInstance.post(API_URL, orderData, { withCredentials: true });
  return response.data;
};

const getMyOrders = async () => {
  const response = await axiosInstance.get(API_URL + 'myorders', { withCredentials: true });
  return response.data;
};

const getOrderById = async (id) => {
  const response = await axiosInstance.get(API_URL + id, { withCredentials: true });
  return response.data;
};

const cancelOrder = async (id) => {
  const response = await axiosInstance.put(`${API_URL}${id}/cancel`, {}, { withCredentials: true });
  return response.data;
};

const payOrder = async (id, paymentResult) => {
  const response = await axiosInstance.put(`${API_URL}${id}/pay`, paymentResult, { withCredentials: true });
  return response.data;
};

// Admin
const getOrders = async () => {
  const response = await axiosInstance.get(API_URL, { withCredentials: true });
  return response.data;
};

const updateOrderStatus = async (id, status) => {
  const response = await axiosInstance.put(`${API_URL}${id}/status`, { status }, { withCredentials: true });
  return response.data;
};

const orderService = {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  payOrder,
  getOrders,
  updateOrderStatus,
};

export default orderService;
