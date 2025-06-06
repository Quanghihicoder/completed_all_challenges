import { configureStore, createSlice } from "@reduxjs/toolkit";

// Initial state
const initialState = {
  size: 3,
  winingCondition: 3,
};

// Create a slice
const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setMapSize: (state, action) => {
      state.size = action.payload;
    },
    setWiningCondition: (state, action) => {
      state.winingCondition = action.payload;
    },
    resetSettings: () => initialState,
  },
});

// Export actions
export const { setMapSize, setWiningCondition, resetSettings } = settingsSlice.actions;

// Create store
const store = configureStore({
  reducer: settingsSlice.reducer,
});

export default store;
