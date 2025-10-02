import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: any = {
  loading: false,
  error: null,
  users: [],
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    loadUsersRequested(state, action: PayloadAction<{}>) {
      state.loading = true;
      state.error = null;
    },
    loadUsersSuccess(state, action: any) {
      state.loading = false;
      state.error = null;
      state.users = action?.payload?.result?.results;
      state.paginationOption = {
        page: action.payload?.result?.page,
        pageSize: action.payload?.result?.pageSize,
        totalItems: action.payload?.result?.totalItems,
        numberOfPages: action.payload?.result?.numberOfPages,
      };
    },
    loadUsersFail(state, action: PayloadAction<{}>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { loadUsersRequested, loadUsersSuccess, loadUsersFail } =
  usersSlice.actions;

export default usersSlice.reducer;
