import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface stateState {
  filters: any;
  page: number;
  perPage: number;
  first: number;
}

const initialState: stateState = {
  filters: {},
  page: 1,
  perPage: 10,
  first: 1,
};

const stateSlice = createSlice({
  name: 'state',
  initialState,
  reducers: {
    updateFilters: (
      state,
      action: PayloadAction<{
        query?: any;
        category?: any;
      }>
    ) => {
      state.filters = action.payload;
    },

    pushPage: (state, action: any) => {
      state.page = action.payload;
    },

    pushPageSize: (state, action: any) => {
      state.perPage = action.payload;
    },

    pushPageFirst: (state, action: any) => {
      state.first = action.payload;
    },
  },
});

export const { updateFilters, pushPage, pushPageSize } = stateSlice.actions;

export default stateSlice.reducer;
