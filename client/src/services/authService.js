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

const authService = { login, register, logout, getProfile };

export default authService;
