import axiosInstance from './axiosInstance.js';

const API_URL = '/addresses/';

const getAddresses = async () => {
  const response = await axiosInstance.get(API_URL, { withCredentials: true });
  return response.data;
};

const createAddress = async (addressData) => {
  const response = await axiosInstance.post(API_URL, addressData, { withCredentials: true });
  return response.data;
};

const updateAddress = async (id, addressData) => {
  const response = await axiosInstance.put(API_URL + id, addressData, { withCredentials: true });
  return response.data;
};

const deleteAddress = async (id) => {
  const response = await axiosInstance.delete(API_URL + id, { withCredentials: true });
  return response.data;
};

const addressService = {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
};

export default addressService;
