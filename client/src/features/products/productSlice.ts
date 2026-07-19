import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import productService, {
  Product,
  ProductsResponse,
  Category,
  ProductQueryParams,
} from '../../services/productService';

interface ProductState {
  products: Product[];
  featuredProducts: Product[];
  relatedProducts: Product[];
  product: Product | null;
  categories: Category[];
  pagination: {
    page: number;
    pages: number;
    total: number;
    limit: number;
  };
  isLoading: boolean;
  isFeaturedLoading: boolean;
  isDetailLoading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  featuredProducts: [],
  relatedProducts: [],
  product: null,
  categories: [],
  pagination: { page: 1, pages: 1, total: 0, limit: 12 },
  isLoading: false,
  isFeaturedLoading: false,
  isDetailLoading: false,
  error: null,
};

export const fetchProducts = createAsyncThunk<ProductsResponse, ProductQueryParams>(
  'products/fetchProducts',
  async (params, thunkAPI) => {
    try {
      return await productService.getProducts(params);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const fetchFeaturedProducts = createAsyncThunk<Product[], number | undefined>(
  'products/fetchFeatured',
  async (limit, thunkAPI) => {
    try {
      return await productService.getFeaturedProducts(limit);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const fetchProductBySlug = createAsyncThunk<Product, string>(
  'products/fetchBySlug',
  async (slug, thunkAPI) => {
    try {
      return await productService.getProductBySlug(slug);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const fetchRelatedProducts = createAsyncThunk<Product[], string>(
  'products/fetchRelated',
  async (slug, thunkAPI) => {
    try {
      return await productService.getRelatedProducts(slug);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const fetchCategories = createAsyncThunk<Category[]>(
  'products/fetchCategories',
  async (_, thunkAPI) => {
    try {
      return await productService.getCategories();
    } catch (err: any) {
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
      .addCase(fetchProducts.rejected, (state, action) => { state.isLoading = false; state.error = action.payload as string; })
      // Featured
      .addCase(fetchFeaturedProducts.pending, (state) => { state.isFeaturedLoading = true; })
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => { state.isFeaturedLoading = false; state.featuredProducts = action.payload; })
      .addCase(fetchFeaturedProducts.rejected, (state) => { state.isFeaturedLoading = false; })
      // Single product
      .addCase(fetchProductBySlug.pending, (state) => { state.isDetailLoading = true; state.error = null; state.product = null; })
      .addCase(fetchProductBySlug.fulfilled, (state, action) => { state.isDetailLoading = false; state.product = action.payload; })
      .addCase(fetchProductBySlug.rejected, (state, action) => { state.isDetailLoading = false; state.error = action.payload as string; })
      // Related
      .addCase(fetchRelatedProducts.fulfilled, (state, action) => { state.relatedProducts = action.payload; })
      // Categories
      .addCase(fetchCategories.fulfilled, (state, action) => { state.categories = action.payload; });
  },
});

export const { clearProductError, clearProduct } = productSlice.actions;
export default productSlice.reducer;
