import axios from 'axios';

const API_URL = '/api/addresses/';

const getAddresses = async () => {
  const response = await axios.get(API_URL, { withCredentials: true });
  return response.data;
};

const createAddress = async (addressData) => {
  const response = await axios.post(API_URL, addressData, { withCredentials: true });
  return response.data;
};

const updateAddress = async (id, addressData) => {
  const response = await axios.put(API_URL + id, addressData, { withCredentials: true });
  return response.data;
};

const deleteAddress = async (id) => {
  const response = await axios.delete(API_URL + id, { withCredentials: true });
  return response.data;
};

const addressService = {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
};

export default addressService;
