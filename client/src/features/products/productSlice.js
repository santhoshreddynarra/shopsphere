import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import productService from '../../services/productService.js';
import axios from 'axios';

const initialState = {
  products: [],
  featuredProducts: [],
  relatedProducts: [],
  bestSellers: [],
  product: null,
  categories: [],
  pagination: { page: 1, pages: 1, total: 0, limit: 12 },
  isLoading: false,
  isFeaturedLoading: false,
  isDetailLoading: false,
  isBestSellersLoading: false,
  error: null,
};

export const fetchBestSellers = createAsyncThunk('products/fetchBestSellers', async (_, thunkAPI) => {
  try {
    const res = await axios.get('/api/products?limit=4&sort=-numSales');
    return res.data.products;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params, thunkAPI) => {
    try {
      return await productService.getProducts(params);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const fetchFeaturedProducts = createAsyncThunk(
  'products/fetchFeatured',
  async (limit, thunkAPI) => {
    try {
      return await productService.getFeaturedProducts(limit);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const fetchProductBySlug = createAsyncThunk(
  'products/fetchBySlug',
  async (slug, thunkAPI) => {
    try {
      return await productService.getProductBySlug(slug);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const fetchRelatedProducts = createAsyncThunk(
  'products/fetchRelated',
  async (slug, thunkAPI) => {
    try {
      return await productService.getRelatedProducts(slug);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async (_, thunkAPI) => {
    try {
      return await productService.getCategories();
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearProductError(state) {
      state.error = null;
    },
    clearProduct(state) {
      state.product = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch products list
      .addCase(fetchProducts.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.products;
        state.pagination = {
          page: action.payload.page,
          pages: action.payload.pages,
          total: action.payload.total,
          limit: action.payload.limit,
        };
      })
      .addCase(fetchProducts.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })
      // Featured
      .addCase(fetchFeaturedProducts.pending, (state) => { state.isFeaturedLoading = true; })
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => { state.isFeaturedLoading = false; state.featuredProducts = action.payload; })
      .addCase(fetchFeaturedProducts.rejected, (state) => { state.isFeaturedLoading = false; })
      // Single product
      .addCase(fetchProductBySlug.pending, (state) => { state.isDetailLoading = true; state.error = null; state.product = null; })
      .addCase(fetchProductBySlug.fulfilled, (state, action) => { state.isDetailLoading = false; state.product = action.payload; })
      .addCase(fetchProductBySlug.rejected, (state, action) => { state.isDetailLoading = false; state.error = action.payload; })
      // Related
      .addCase(fetchRelatedProducts.fulfilled, (state, action) => { state.relatedProducts = action.payload; })
      // Best Sellers
      .addCase(fetchBestSellers.pending, (state) => { state.isBestSellersLoading = true; })
      .addCase(fetchBestSellers.fulfilled, (state, action) => {
        state.isBestSellersLoading = false;
        state.bestSellers = action.payload;
      })
      .addCase(fetchBestSellers.rejected, (state, action) => {
        state.isBestSellersLoading = false;
        state.error = action.payload;
      })
      // Categories
      .addCase(fetchCategories.fulfilled, (state, action) => { state.categories = action.payload; });
  },
});

export const { clearProductError, clearProduct } = productSlice.actions;
export default productSlice.reducer;
