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
    return await wishlistService.getWishlist();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const addToWishlist = createAsyncThunk('wishlist/addToWishlist', async (productId, thunkAPI) => {
  try {
    await wishlistService.addToWishlist(productId);
    return await wishlistService.getWishlist();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const removeFromWishlist = createAsyncThunk('wishlist/removeFromWishlist', async (productId, thunkAPI) => {
  try {
    await wishlistService.removeFromWishlist(productId);
    return await wishlistService.getWishlist();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const moveToCart = createAsyncThunk('wishlist/moveToCart', async (productId, thunkAPI) => {
  try {
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
