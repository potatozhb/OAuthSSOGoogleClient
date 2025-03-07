import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import ReduxLogger from "redux-logger";
import appReducer from "./appSlice";
import { Middleware } from 'redux';

export const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(ReduxLogger as Middleware<{}>),
  reducer: {
    app: appReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
