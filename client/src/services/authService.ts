import axiosInstance from './axiosInstance';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface UserInfo {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

const login = async (credentials: LoginCredentials): Promise<UserInfo> => {
  const { data } = await axiosInstance.post<UserInfo>('/users/login', credentials);
  return data;
};

const register = async (userData: RegisterData): Promise<UserInfo> => {
  const { data } = await axiosInstance.post<UserInfo>('/users', userData);
  return data;
};

const logout = async (): Promise<void> => {
  await axiosInstance.post('/users/logout');
};

const getProfile = async (): Promise<UserInfo> => {
  const { data } = await axiosInstance.get<UserInfo>('/users/profile');
  return data;
};

const authService = { login, register, logout, getProfile };

export default authService;
