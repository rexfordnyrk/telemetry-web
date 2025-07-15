import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Alert {
  id: string;
  type: "success" | "danger" | "warning" | "info";
  title: string;
  message: string;
  timestamp: number;
}

interface AlertState {
  alerts: Alert[];
}

const initialState: AlertState = {
  alerts: [],
};

const alertSlice = createSlice({
  name: "alerts",
  initialState,
  reducers: {
    addAlert: (
      state,
      action: PayloadAction<Omit<Alert, "id" | "timestamp">>,
    ) => {
      const alert: Alert = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: Date.now(),
      };
      state.alerts.push(alert);
    },
    removeAlert: (state, action: PayloadAction<string>) => {
      state.alerts = state.alerts.filter(
        (alert) => alert.id !== action.payload,
      );
    },
    clearAlerts: (state) => {
      state.alerts = [];
    },
  },
});

export const { addAlert, removeAlert, clearAlerts } = alertSlice.actions;

export default alertSlice.reducer;
