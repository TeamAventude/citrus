import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer, PURGE } from "redux-persist";
import persistConfig from "persist";
import authReducer from "store/auth/authSlice";
import stateReducer from "store/state/stateSlice";
import userReducer from "store/users/userSlice";
import dashboardReducer from "store/dashboard/dashboardSlice";
const appReducer = combineReducers({
  auth: persistReducer(persistConfig, authReducer),
  state: stateReducer,
  user: userReducer,
  dashboard: dashboardReducer,
});

const rootReducer = (state: any, action: any) => {
  if (action.type === PURGE) {
    return appReducer(undefined, action);
  }

  return appReducer(state, action);
};

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
