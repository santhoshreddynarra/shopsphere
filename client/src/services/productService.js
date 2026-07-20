import axiosInstance from './axiosInstance.js';

const getProducts = async (params) => {
  // Remove undefined/empty values from params
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== '' && v !== false)
  );
  const { data } = await axiosInstance.get('/products', { params: cleanParams });
  return data;
};

const getFeaturedProducts = async (limit = 8) => {
  const { data } = await axiosInstance.get('/products/featured', { params: { limit } });
  return data;
};

const getProductBySlug = async (slug) => {
  const { data } = await axiosInstance.get(`/products/${slug}`);
  return data;
};

const getRelatedProducts = async (slug) => {
  const { data } = await axiosInstance.get(`/products/${slug}/related`);
  return data;
};

const getCategories = async () => {
  const { data } = await axiosInstance.get('/categories');
  return data;
};

const productService = {
  getProducts,
  getFeaturedProducts,
  getProductBySlug,
  getRelatedProducts,
  getCategories,
};

export default productService;
