import axiosInstance from './axiosInstance.js';

const login = async (credentials) => {
  const { data } = await axiosInstance.post('/users/login', credentials);
  return data;
};

const register = async (userData) => {
  const { data } = await axiosInstance.post('/users', userData);
  return data;
};

const logout = async () => {
  await axiosInstance.post('/users/logout');
};

const getProfile = async () => {
  const { data } = await axiosInstance.get('/users/profile');
  return data;
};

const updateProfile = async (userData) => {
  const { data } = await axiosInstance.put('/users/profile', userData);
  return data;
};

const authService = { login, register, logout, getProfile, updateProfile };

export default authService;
