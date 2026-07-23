import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchPagesApi,
  fetchPageBySlugApi,
  createPageApi,
  updatePageApi,
  deletePageApi,
} from '../../services/pageService';

export const getPagesThunk = createAsyncThunk(
  'pages/getPages',
  async (params, { rejectWithValue }) => {
    try {
      const res = await fetchPagesApi(params);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getPageBySlugThunk = createAsyncThunk(
  'pages/getPageBySlug',
  async (slug, { rejectWithValue }) => {
    try {
      const res = await fetchPageBySlugApi(slug);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createPageThunk = createAsyncThunk(
  'pages/createPage',
  async (pageData, { rejectWithValue }) => {
    try {
      const res = await createPageApi(pageData);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updatePageThunk = createAsyncThunk(
  'pages/updatePage',
  async ({ id, pageData }, { rejectWithValue }) => {
    try {
      const res = await updatePageApi(id, pageData);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deletePageThunk = createAsyncThunk(
  'pages/deletePage',
  async (id, { rejectWithValue }) => {
    try {
      await deletePageApi(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const pageSlice = createSlice({
  name: 'pages',
  initialState: {
    list: [],
    currentPage: null,
    loading: false,
    error: null,
    searchTerm: '',
    statusFilter: 'all',
  },
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    clearCurrentPage: (state) => {
      state.currentPage = null;
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setStatusFilter: (state, action) => {
      state.statusFilter = action.payload;
    },
    clearPageError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // getPages
      .addCase(getPagesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPagesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(getPagesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // getPageBySlug
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
      })
      // createPage
      .addCase(createPageThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPageThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.list.unshift(action.payload);
        state.currentPage = action.payload;
      })
      .addCase(createPageThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // updatePage
      .addCase(updatePageThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePageThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPage = action.payload;
        const idx = state.list.findIndex((p) => p._id === action.payload._id);
        if (idx !== -1) {
          state.list[idx] = action.payload;
        }
      })
      .addCase(updatePageThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // deletePage
      .addCase(deletePageThunk.fulfilled, (state, action) => {
        state.list = state.list.filter((p) => p._id !== action.payload);
        if (state.currentPage && state.currentPage._id === action.payload) {
          state.currentPage = null;
        }
      });
  },
});

export const {
  setCurrentPage,
  clearCurrentPage,
  setSearchTerm,
  setStatusFilter,
  clearPageError,
} = pageSlice.actions;

export default pageSlice.reducer;
