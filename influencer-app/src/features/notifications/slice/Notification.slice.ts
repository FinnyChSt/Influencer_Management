import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type NotificationType = "success" | "error" | "info" | "warning";

export interface NotificationState {
  isVisible: boolean;
  type: NotificationType;
  title: string;
  message?: string;
}

const initialState: NotificationState = {
  isVisible: false,
  type: "info",
  title: "",
  message: "",
};

export const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    showNotification: (
      state,
      action: PayloadAction<Omit<NotificationState, "isVisible">>
    ) => {
      state.isVisible = true;
      state.type = action.payload.type;
      state.title = action.payload.title;
      state.message = action.payload.message;
    },
    hideNotification: (state) => {
      state.isVisible = false;
    },
  },
});

export const { showNotification, hideNotification } = notificationSlice.actions;

export default notificationSlice.reducer;
