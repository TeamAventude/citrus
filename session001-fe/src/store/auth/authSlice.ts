import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: any = {
  loading: false,
  auth: null,
  error: null,
  tokenType: "Bearer",
  selectedOption: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginRequested(
      state,
      action: PayloadAction<{ username: string; password: string }>
    ) {
      state.loading = true;
      state.error = null;
    },
    loginSuccess(state, action: PayloadAction<any>) {
      state.loading = false;
      state.error = null;
      state.auth = action.payload;
    },

    loginFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    loadUserPermissionRequested(state, action: PayloadAction<{ id: number }>) {
      state.loading = true;
      state.error = null;
    },
    loadUserPermissionSuccess(state, action: PayloadAction<any>) {
      state.loading = false;
      state.error = null;
      state.permission = action.payload.result;
    },

    loadUserPermissionFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  loginRequested,
  loginSuccess,
  loginFailure,
  loadUserPermissionFailure,
  loadUserPermissionRequested,
  loadUserPermissionSuccess,
} = authSlice.actions;

export default authSlice.reducer;
