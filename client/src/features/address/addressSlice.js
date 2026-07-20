import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import addressService from '../../services/addressService.js';

const initialState = {
  addresses: [],
  isLoading: false,
  error: null,
};

export const fetchAddresses = createAsyncThunk('address/fetchAddresses', async (_, thunkAPI) => {
  try {
    return await addressService.getAddresses();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const addAddress = createAsyncThunk('address/addAddress', async (addressData, thunkAPI) => {
  try {
    await addressService.createAddress(addressData);
    return await addressService.getAddresses();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const updateAddress = createAsyncThunk('address/updateAddress', async ({ id, addressData }, thunkAPI) => {
  try {
    await addressService.updateAddress(id, addressData);
    return await addressService.getAddresses();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const deleteAddress = createAsyncThunk('address/deleteAddress', async (id, thunkAPI) => {
  try {
    await addressService.deleteAddress(id);
    return await addressService.getAddresses();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    clearAddressError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Addresses
      .addCase(fetchAddresses.pending, (state) => { state.isLoading = true; })
      .addCase(fetchAddresses.fulfilled, (state, action) => { state.isLoading = false; state.addresses = action.payload; state.error = null; })
      .addCase(fetchAddresses.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })
      
      // Add Address
      .addCase(addAddress.pending, (state) => { state.isLoading = true; })
      .addCase(addAddress.fulfilled, (state, action) => { state.isLoading = false; state.addresses = action.payload; state.error = null; })
      .addCase(addAddress.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })
      
      // Update Address
      .addCase(updateAddress.pending, (state) => { state.isLoading = true; })
      .addCase(updateAddress.fulfilled, (state, action) => { state.isLoading = false; state.addresses = action.payload; state.error = null; })
      .addCase(updateAddress.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })
      
      // Delete Address
      .addCase(deleteAddress.pending, (state) => { state.isLoading = true; })
      .addCase(deleteAddress.fulfilled, (state, action) => { state.isLoading = false; state.addresses = action.payload; state.error = null; })
      .addCase(deleteAddress.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; });
  },
});

export const { clearAddressError } = addressSlice.actions;
export default addressSlice.reducer;
