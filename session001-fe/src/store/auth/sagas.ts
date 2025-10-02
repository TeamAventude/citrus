import { takeLatest, put, call } from "redux-saga/effects";
import { axiosInstance, apiURL } from "config";
import toast from "react-hot-toast";

import {
  loginRequested,
  loginSuccess,
  loginFailure,
  loadUserPermissionFailure,
  loadUserPermissionRequested,
  loadUserPermissionSuccess,
} from "./authSlice";

function* loginEffect(action: {
  type: string;
  payload: any;
}): Generator<any, void, any> {
  try {
    const { data } = yield call(
      axiosInstance.post,
      `${apiURL}/login`,
      action.payload
    );

    if (data?.status) {
      yield put(loginSuccess(data));
      yield call(loadUserPermissionEffect, {
        payload: { id: data?.user.id },
        type: "",
      });

      toast.success("Login succeessfully");
      window.location.href = "./";
    } else {
      if (data?.errors) {
        toast.error(data?.errors[0]);
      } else {
        toast.error("Login Failed");
      }
    }
  } catch (error: any) {
    yield put(loginFailure(error.message));
  }
}

export function* loadUserPermissionEffect(action: {
  type: string;
  payload: any;
}): Generator<any, void, any> {
  try {
    const { data } = yield call(
      axiosInstance.get,
      `${apiURL}/get-role-permission-by-userid?Id=${action.payload.id}`
    );

    yield put(loadUserPermissionSuccess(data));
  } catch (error: any) {
    yield put(loadUserPermissionFailure(error.message));
  }
}

export function* authSaga(): Generator<any, void, any> {
  yield takeLatest(loginRequested, loginEffect);
  yield takeLatest(loadUserPermissionRequested, loadUserPermissionEffect);
}
