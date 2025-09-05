import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import alertReducer from "./slices/alertSlice";
import authReducer from "./slices/authSlice";
import beneficiaryReducer from "./slices/beneficiarySlice";
import deviceReducer from "./slices/deviceSlice";
import deviceAssignmentReducer from "./slices/deviceAssignmentSlice";

export const store = configureStore({
  reducer: {
    users: userReducer,
    alerts: alertReducer,
    auth: authReducer,
    beneficiaries: beneficiaryReducer,
    devices: deviceReducer,
    deviceAssignments: deviceAssignmentReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
