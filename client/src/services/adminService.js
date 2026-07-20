import axiosInstance from './axiosInstance.js';

const API_URL = '/admin/';

const getDashboardStats = async () => {
  const response = await axiosInstance.get(API_URL + 'stats', { withCredentials: true });
  return response.data;
};

const getUsers = async () => {
  const response = await axiosInstance.get(API_URL + 'users', { withCredentials: true });
  return response.data;
};

const updateUserRole = async (id, isAdmin) => {
  const response = await axiosInstance.put(API_URL + 'users/' + id + '/role', { isAdmin }, { withCredentials: true });
  return response.data;
};

const adminService = {
  getDashboardStats,
  getUsers,
  updateUserRole,
};

export default adminService;
