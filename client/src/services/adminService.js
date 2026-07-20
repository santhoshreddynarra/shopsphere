import axios from 'axios';

const API_URL = '/api/admin/';

const getDashboardStats = async () => {
  const response = await axios.get(API_URL + 'stats', { withCredentials: true });
  return response.data;
};

const getUsers = async () => {
  const response = await axios.get(API_URL + 'users', { withCredentials: true });
  return response.data;
};

const updateUserRole = async (id, isAdmin) => {
  const response = await axios.put(API_URL + 'users/' + id + '/role', { isAdmin }, { withCredentials: true });
  return response.data;
};

const adminService = {
  getDashboardStats,
  getUsers,
  updateUserRole,
};

export default adminService;
