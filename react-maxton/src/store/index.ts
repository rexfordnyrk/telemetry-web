import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import alertReducer from "./slices/alertSlice";

export const store = configureStore({
  reducer: {
    users: userReducer,
    alerts: alertReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
