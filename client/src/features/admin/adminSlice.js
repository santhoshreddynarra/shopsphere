import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import adminService from '../../services/adminService.js';

const initialState = {
  stats: null,
  users: [],
  isLoading: false,
  error: null,
};

export const fetchDashboardStats = createAsyncThunk('admin/fetchDashboardStats', async (_, thunkAPI) => {
  try {
    return await adminService.getDashboardStats();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const fetchUsers = createAsyncThunk('admin/fetchUsers', async (_, thunkAPI) => {
  try {
    return await adminService.getUsers();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const updateRole = createAsyncThunk('admin/updateRole', async ({ id, isAdmin }, thunkAPI) => {
  try {
    return await adminService.updateUserRole(id, isAdmin);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Stats
      .addCase(fetchDashboardStats.pending, (state) => { state.isLoading = true; })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => { state.isLoading = false; state.stats = action.payload; state.error = null; })
      .addCase(fetchDashboardStats.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })
      
      // Users
      .addCase(fetchUsers.pending, (state) => { state.isLoading = true; })
      .addCase(fetchUsers.fulfilled, (state, action) => { state.isLoading = false; state.users = action.payload; state.error = null; })
      .addCase(fetchUsers.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })
      
      // Update Role
      .addCase(updateRole.pending, (state) => { state.isLoading = true; })
      .addCase(updateRole.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = state.users.map(u => u._id === action.payload._id ? action.payload : u);
        state.error = null;
      })
      .addCase(updateRole.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; });
  },
});

export default adminSlice.reducer;
