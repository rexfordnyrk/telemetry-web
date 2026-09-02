import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import toastAlertReducer from "./slices/alertSlice";
import alertsReducer from "./slices/alertsSlice";
import authReducer from "./slices/authSlice";
import beneficiaryReducer from "./slices/beneficiarySlice";
import deviceReducer from "./slices/deviceSlice";
import deviceAssignmentReducer from "./slices/deviceAssignmentSlice";
import visitReducer from "./slices/visitSlice";
import rolesPermissionsReducer from "./slices/rolesPermissionsSlice";
import globalFiltersReducer from "./slices/globalFiltersSlice";

export const store = configureStore({
  reducer: {
    users: userReducer,
    toastAlerts: toastAlertReducer,
    alerts: alertsReducer,
    auth: authReducer,
    beneficiaries: beneficiaryReducer,
    devices: deviceReducer,
    deviceAssignments: deviceAssignmentReducer,
    visits: visitReducer,
    rolesPermissions: rolesPermissionsReducer,
    globalFilters: globalFiltersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
