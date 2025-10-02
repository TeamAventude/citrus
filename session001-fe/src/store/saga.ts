import { all } from "redux-saga/effects";
import { authSaga } from "store/auth/sagas";
import { usersSaga } from "./users/saga";
import { dashboardSaga } from "./dashboard/sagas";

export function* rootSaga() {
  yield all([authSaga(), usersSaga(), dashboardSaga()]);
}
