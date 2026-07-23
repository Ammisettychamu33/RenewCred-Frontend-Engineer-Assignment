import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    isSidebarOpen: true,
    toasts: [],
  },
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.isSidebarOpen = action.payload;
    },
    addToast: (state, action) => {
      // payload: { id, type: 'success'|'error'|'info'|'warning', message }
      state.toasts.push({
        id: action.payload.id || Date.now(),
        type: action.payload.type || 'info',
        message: action.payload.message,
      });
    },
    removeToast: (state, action) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
  },
});

export const { toggleSidebar, setSidebarOpen, addToast, removeToast } = uiSlice.actions;
export default uiSlice.reducer;
