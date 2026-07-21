import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const backendMessage = error.response?.data?.message || error.response?.data?.error;

    let userMessage = backendMessage;

    // Filter out generic Axios strings (e.g. "Request failed with status code 401", "AxiosError")
    if (
      !userMessage ||
      typeof userMessage !== 'string' ||
      userMessage.startsWith('Request failed with status code') ||
      userMessage.includes('AxiosError')
    ) {
      if (!error.response) {
        userMessage = 'Something went wrong. Please try again later.';
      } else if (status === 400) {
        userMessage = 'Please check your input and try again.';
      } else if (status === 401) {
        userMessage = 'Invalid email or password';
      } else if (status === 403) {
        userMessage = 'Unauthorized access';
      } else if (status === 404) {
        userMessage = 'User not found';
      } else if (status === 409) {
        userMessage = 'User already exists';
      } else {
        userMessage = 'Something went wrong. Please try again later.';
      }
    }

    // Standardize error properties for Redux thunks and components
    error.userMessage = userMessage;
    if (error.response && typeof error.response.data === 'object' && error.response.data !== null) {
      error.response.data.message = userMessage;
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;