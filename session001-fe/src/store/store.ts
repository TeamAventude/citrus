import { configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import createSagaMiddleware from "redux-saga";
import { createAxios } from "config/axios";

//
import rootReducer from "./reducer";
import { rootSaga } from "./saga";

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => {
    const middleware = getDefaultMiddleware({
      thunk: false,
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }) as any;

    return middleware.concat([sagaMiddleware]);
  },
});

sagaMiddleware.run(rootSaga);
export type State = ReturnType<typeof store.getState>;

export const persistor = persistStore(store);
createAxios(store);

export default store;
