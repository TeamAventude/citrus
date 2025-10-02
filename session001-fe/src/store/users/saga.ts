import { put, call, takeEvery } from "redux-saga/effects";
import { axiosInstance, apiURL } from "config";

import {
  loadUsersRequested,
  loadUsersSuccess,
  loadUsersFail,
} from "./userSlice";

export function* loadUsersEffect(action: {
  type: string;
  payload: any;
}): Generator<any, void, any> {
  try {
    const { data } = yield call(
      axiosInstance.get,
      `${apiURL}/users?SearchValue=${
        action?.payload?.filters?.query ?? ""
      }&PaginationOption.Page=${
        action.payload.page
      }&PaginationOption.PageSize=${action.payload.perPage}`
    );

    yield put(loadUsersSuccess(data));
  } catch (error: any) {
    yield put(loadUsersFail(error.message));
  }
}

export function* usersSaga(): Generator<any, void, any> {
  yield takeEvery(loadUsersRequested, loadUsersEffect);
}
