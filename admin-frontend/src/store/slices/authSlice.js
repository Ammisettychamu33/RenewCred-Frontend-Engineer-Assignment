import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginApi, logoutApi } from '../../services/authService';

const storedToken = localStorage.getItem('renewcred_token');
const storedUser = localStorage.getItem('renewcred_user')
  ? JSON.parse(localStorage.getItem('renewcred_user'))
  : null;

export const loginAdminThunk = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await loginApi(credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const logoutAdminThunk = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      return true;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: storedToken || null,
    user: storedUser || null,
    isAuthenticated: !!storedToken,
    loading: false,
    error: null,
  },
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginAdminThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAdminThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        localStorage.setItem('renewcred_token', action.payload.token);
        localStorage.setItem('renewcred_user', JSON.stringify(action.payload.user));
      })
      .addCase(loginAdminThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
      })
      // Logout
      .addCase(logoutAdminThunk.fulfilled, (state) => {
        state.token = null;
        state.user = null;
        state.isAuthenticated = false;
        localStorage.removeItem('renewcred_token');
        localStorage.removeItem('renewcred_user');
      });
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;
