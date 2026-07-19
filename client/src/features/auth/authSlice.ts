import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService, { LoginCredentials, RegisterData, UserInfo } from '../../services/authService';

interface AuthState {
  userInfo: UserInfo | null;
  isLoading: boolean;
  error: string | null;
}

const storedUser = localStorage.getItem('userInfo');
const initialState: AuthState = {
  userInfo: storedUser ? JSON.parse(storedUser) : null,
  isLoading: false,
  error: null,
};

export const login = createAsyncThunk<UserInfo, LoginCredentials>(
  'auth/login',
  async (credentials, thunkAPI) => {
    try {
      const data = await authService.login(credentials);
      localStorage.setItem('userInfo', JSON.stringify(data));
      return data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const register = createAsyncThunk<UserInfo, RegisterData>(
  'auth/register',
  async (userData, thunkAPI) => {
    try {
      const data = await authService.register(userData);
      localStorage.setItem('userInfo', JSON.stringify(data));
      return data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  try {
    await authService.logout();
    localStorage.removeItem('userInfo');
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.message);
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
      .addCase(login.rejected, (state, action) => { state.isLoading = false; state.error = action.payload as string; })
      // Register
      .addCase(register.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(register.fulfilled, (state, action) => { state.isLoading = false; state.userInfo = action.payload; })
      .addCase(register.rejected, (state, action) => { state.isLoading = false; state.error = action.payload as string; })
      // Logout
      .addCase(logout.fulfilled, (state) => { state.userInfo = null; state.error = null; });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
