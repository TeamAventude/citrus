import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: any = {
  totalCount: [],
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    //load dashboard total customers
    loadTotalCountRequested(state, action: PayloadAction<{}>) {
      state.loading = true;
      state.error = null;
    },
    loadTotalCountSuccess(state, action: any) {
      state.loading = false;
      state.error = null;
      state.totalCount = action?.payload?.result;
    },
    loadTotalCountFail(state, action: PayloadAction<{}>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  loadTotalCountRequested,
  loadTotalCountSuccess,
  loadTotalCountFail,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
