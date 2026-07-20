import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import wishlistService from '../../services/wishlistService.js';
import { addToCart } from '../cart/cartSlice.js';

const initialState = {
  wishlist: { products: [] },
  isLoading: false,
  error: null,
};

export const fetchWishlist = createAsyncThunk('wishlist/fetchWishlist', async (_, thunkAPI) => {
  try {
    const { auth } = thunkAPI.getState();
    if (!auth.userInfo) {
      const localWishlist = JSON.parse(localStorage.getItem('wishlist') || '{"products":[]}');
      return localWishlist;
    }
    return await wishlistService.getWishlist();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const addToWishlist = createAsyncThunk('wishlist/addToWishlist', async (payload, thunkAPI) => {
  try {
    const { auth } = thunkAPI.getState();
    const productId = payload.productId || payload.product._id;

    if (!auth.userInfo) {
      if (!payload.product) throw new Error('Product details missing for guest wishlist');
      const localWishlist = JSON.parse(localStorage.getItem('wishlist') || '{"products":[]}');
      
      const exists = localWishlist.products.some(p => p.productId._id === productId);
      if (!exists) {
        localWishlist.products.push({ productId: payload.product });
        localStorage.setItem('wishlist', JSON.stringify(localWishlist));
      }
      return localWishlist;
    }

    await wishlistService.addToWishlist(productId);
    return await wishlistService.getWishlist();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const removeFromWishlist = createAsyncThunk('wishlist/removeFromWishlist', async (productId, thunkAPI) => {
  try {
    const { auth } = thunkAPI.getState();
    if (!auth.userInfo) {
      const localWishlist = JSON.parse(localStorage.getItem('wishlist') || '{"products":[]}');
      localWishlist.products = localWishlist.products.filter(p => p.productId._id !== productId);
      localStorage.setItem('wishlist', JSON.stringify(localWishlist));
      return localWishlist;
    }

    await wishlistService.removeFromWishlist(productId);
    return await wishlistService.getWishlist();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const moveToCart = createAsyncThunk('wishlist/moveToCart', async (payload, thunkAPI) => {
  try {
    const { auth } = thunkAPI.getState();
    const productId = payload.productId || payload.product?._id;

    if (!auth.userInfo) {
      // Guest mode: dispatch addToCart with full product, then remove from guest wishlist
      await thunkAPI.dispatch(addToCart({ product: payload.product, quantity: 1 })).unwrap();
      await thunkAPI.dispatch(removeFromWishlist(productId)).unwrap();
      return JSON.parse(localStorage.getItem('wishlist') || '{"products":[]}');
    }

    // Pass only productId to addToCart for logged-in user, but payload might be full product or just id
    await thunkAPI.dispatch(addToCart({ productId, quantity: 1 })).unwrap();
    await wishlistService.removeFromWishlist(productId);
    return await wishlistService.getWishlist();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    clearWishlistError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Wishlist
      .addCase(fetchWishlist.pending, (state) => { state.isLoading = true; })
      .addCase(fetchWishlist.fulfilled, (state, action) => { state.isLoading = false; state.wishlist = action.payload; state.error = null; })
      .addCase(fetchWishlist.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })
      
      // Add to Wishlist
      .addCase(addToWishlist.pending, (state) => { state.isLoading = true; })
      .addCase(addToWishlist.fulfilled, (state, action) => { state.isLoading = false; state.wishlist = action.payload; state.error = null; })
      .addCase(addToWishlist.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })
      
      // Remove from Wishlist
      .addCase(removeFromWishlist.pending, (state) => { state.isLoading = true; })
      .addCase(removeFromWishlist.fulfilled, (state, action) => { state.isLoading = false; state.wishlist = action.payload; state.error = null; })
      .addCase(removeFromWishlist.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })
      
      // Move to Cart
      .addCase(moveToCart.pending, (state) => { state.isLoading = true; })
      .addCase(moveToCart.fulfilled, (state, action) => { state.isLoading = false; state.wishlist = action.payload; state.error = null; })
      .addCase(moveToCart.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })

      // Clear Wishlist on Logout
      .addCase('auth/logout/fulfilled', (state) => {
        state.wishlist = { products: [] };
        state.error = null;
      });
  },
});

export const { clearWishlistError } = wishlistSlice.actions;
export default wishlistSlice.reducer;
