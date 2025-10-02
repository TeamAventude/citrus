import { put, call, takeEvery } from "redux-saga/effects";
import { axiosInstance, apiURL } from "config";

import {
  loadTotalCountSuccess,
  loadTotalCountFail,
  loadTotalCountRequested,
} from "./dashboardSlice";
import toast from "react-hot-toast";

export function* loadTotalCountEffect(action: {
  type: string;
  payload: any;
}): Generator<any, void, any> {
  try {
    // debugger;
    const { data } = yield call(
      axiosInstance.get,
      `${apiURL}/dashboard/attributes/count`
    );

    if (data?.succeeded) {
      yield put(loadTotalCountSuccess(data));
    } else {
      toast.error(data?.errors);
    }
  } catch (error: any) {
    yield put(loadTotalCountFail(error.message));
  }
}

export function* dashboardSaga(): Generator<any, void, any> {
  yield takeEvery(loadTotalCountRequested, loadTotalCountEffect);
}
