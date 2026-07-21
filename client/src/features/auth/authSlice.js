import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/authService.js';
import cartService from '../../services/cartService.js';
import wishlistService from '../../services/wishlistService.js';
import { fetchCart } from '../cart/cartSlice.js';
import { fetchWishlist } from '../wishlist/wishlistSlice.js';

const storedUser = localStorage.getItem('userInfo');
const initialState = {
  userInfo: storedUser ? JSON.parse(storedUser) : null,
  isLoading: false,
  error: null,
};

const mergeGuestData = async (user, thunkAPI) => {
  try {
    const localCart = JSON.parse(localStorage.getItem('cart'));
    if (localCart && localCart.products && localCart.products.length > 0) {
      for (const item of localCart.products) {
        const pId = item.productId?._id || item.productId;
        if (pId) {
          await cartService.addToCart({ productId: pId, quantity: item.quantity || 1 });
        }
      }
      localStorage.removeItem('cart');
    }

    const localWishlist = JSON.parse(localStorage.getItem('wishlist'));
    if (localWishlist && localWishlist.products && localWishlist.products.length > 0) {
      for (const item of localWishlist.products) {
        const pId = item.productId?._id || item.productId;
        if (pId) {
          await wishlistService.addToWishlist(pId);
        }
      }
      localStorage.removeItem('wishlist');
    }
  } catch (error) {
    console.error('Failed to merge guest data', error);
  }
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, thunkAPI) => {
    try {
      const data = await authService.login(credentials);
      localStorage.setItem('userInfo', JSON.stringify(data));
      await mergeGuestData(data, thunkAPI);
      thunkAPI.dispatch(fetchCart());
      thunkAPI.dispatch(fetchWishlist());
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData, thunkAPI) => {
    try {
      const data = await authService.register(userData);
      localStorage.setItem('userInfo', JSON.stringify(data));
      await mergeGuestData(data, thunkAPI);
      thunkAPI.dispatch(fetchCart());
      thunkAPI.dispatch(fetchWishlist());
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const getProfileDetails = createAsyncThunk(
  'auth/getProfileDetails',
  async (_, thunkAPI) => {
    try {
      const data = await authService.getProfile();
      localStorage.setItem('userInfo', JSON.stringify(data));
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'auth/updateUserProfile',
  async (userData, thunkAPI) => {
    try {
      const data = await authService.updateProfile(userData);
      localStorage.setItem('userInfo', JSON.stringify(data));
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  try {
    await authService.logout();
    localStorage.removeItem('userInfo');
    localStorage.removeItem('cart');
    localStorage.removeItem('wishlist');
    return null;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(login.fulfilled, (state, action) => { state.isLoading = false; state.userInfo = action.payload; })
      .addCase(login.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })
      // Register
      .addCase(register.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(register.fulfilled, (state, action) => { state.isLoading = false; state.userInfo = action.payload; })
      .addCase(register.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })
      // Get Profile
      .addCase(getProfileDetails.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(getProfileDetails.fulfilled, (state, action) => { state.isLoading = false; state.userInfo = action.payload; })
      .addCase(getProfileDetails.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })
      // Update Profile
      .addCase(updateUserProfile.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(updateUserProfile.fulfilled, (state, action) => { state.isLoading = false; state.userInfo = action.payload; })
      .addCase(updateUserProfile.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })
      // Logout
      .addCase(logout.fulfilled, (state) => { state.userInfo = null; state.error = null; });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
