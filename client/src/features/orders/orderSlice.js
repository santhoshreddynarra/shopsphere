import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import orderService from '../../services/orderService.js';

const initialState = {
  orders: [],
  order: null,
  isLoading: false,
  error: null,
};

export const fetchMyOrders = createAsyncThunk('order/fetchMyOrders', async (_, thunkAPI) => {
  try {
    return await orderService.getMyOrders();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const fetchOrderById = createAsyncThunk('order/fetchOrderById', async (id, thunkAPI) => {
  try {
    return await orderService.getOrderById(id);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const cancelMyOrder = createAsyncThunk('order/cancelMyOrder', async (id, thunkAPI) => {
  try {
    return await orderService.cancelOrder(id);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrderError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch My Orders
      .addCase(fetchMyOrders.pending, (state) => { state.isLoading = true; })
      .addCase(fetchMyOrders.fulfilled, (state, action) => { state.isLoading = false; state.orders = action.payload; state.error = null; })
      .addCase(fetchMyOrders.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })
      
      // Fetch Order By Id
      .addCase(fetchOrderById.pending, (state) => { state.isLoading = true; })
      .addCase(fetchOrderById.fulfilled, (state, action) => { state.isLoading = false; state.order = action.payload; state.error = null; })
      .addCase(fetchOrderById.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })
      
      // Cancel Order
      .addCase(cancelMyOrder.pending, (state) => { state.isLoading = true; })
      .addCase(cancelMyOrder.fulfilled, (state, action) => { 
        state.isLoading = false; 
        state.order = action.payload; 
        state.orders = state.orders.map(o => o._id === action.payload._id ? action.payload : o);
        state.error = null; 
      })
      .addCase(cancelMyOrder.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; });
  },
});

export const { clearOrderError } = orderSlice.actions;
export default orderSlice.reducer;
