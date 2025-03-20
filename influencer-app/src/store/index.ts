import { configureStore } from "@reduxjs/toolkit";
import notificationReducer from "../features/notifications/slice/Notification.slice";
import influencerReducer from "../features/influencers/slice/Influencer.slice";

export const store = configureStore({
  reducer: {
    notification: notificationReducer,
    influencers: influencerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
