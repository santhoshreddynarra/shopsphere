import axiosInstance from './axiosInstance';

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  brand: string;
  category: { _id: string; name: string; slug: string };
  price: number;
  discountPrice: number;
  images: string[];
  stock: number;
  sku: string;
  rating: number;
  numReviews: number;
  specifications: { key: string; value: string }[];
  isFeatured: boolean;
  isActive: boolean;
  numSales: number;
  createdAt: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
}

export interface ProductQueryParams {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStock?: boolean;
  sortBy?: string;
  page?: number;
  limit?: number;
}

export interface ProductsResponse {
  products: Product[];
  page: number;
  pages: number;
  total: number;
  limit: number;
}

const getProducts = async (params: ProductQueryParams): Promise<ProductsResponse> => {
  // Remove undefined/empty values from params
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== '' && v !== false)
  );
  const { data } = await axiosInstance.get<ProductsResponse>('/products', { params: cleanParams });
  return data;
};

const getFeaturedProducts = async (limit = 8): Promise<Product[]> => {
  const { data } = await axiosInstance.get<Product[]>('/products/featured', { params: { limit } });
  return data;
};

const getProductBySlug = async (slug: string): Promise<Product> => {
  const { data } = await axiosInstance.get<Product>(`/products/${slug}`);
  return data;
};

const getRelatedProducts = async (slug: string): Promise<Product[]> => {
  const { data } = await axiosInstance.get<Product[]>(`/products/${slug}/related`);
  return data;
};

const getCategories = async (): Promise<Category[]> => {
  const { data } = await axiosInstance.get<Category[]>('/categories');
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
