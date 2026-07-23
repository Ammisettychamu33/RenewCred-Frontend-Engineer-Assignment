import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchPublishedPagesApi, fetchPageBySlugApi } from '../../services/pageService';

export const getNavPagesThunk = createAsyncThunk(
  'publicPages/getNavPages',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetchPublishedPagesApi();
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getPageBySlugThunk = createAsyncThunk(
  'publicPages/getPageBySlug',
  async (slug, { rejectWithValue }) => {
    try {
      const res = await fetchPageBySlugApi(slug);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const pageSlice = createSlice({
  name: 'publicPages',
  initialState: {
    navPages: [],
    currentPage: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentPage: (state) => {
      state.currentPage = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Nav Pages
      .addCase(getNavPagesThunk.fulfilled, (state, action) => {
        state.navPages = action.payload;
      })
      // Get Page By Slug
      .addCase(getPageBySlugThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPageBySlugThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPage = action.payload;
      })
      .addCase(getPageBySlugThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.currentPage = null;
      });
  },
});

export const { clearCurrentPage } = pageSlice.actions;
export default pageSlice.reducer;
