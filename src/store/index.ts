import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

// Re-export action agar panggilannya dari komponen jadi lebih pendek dan rapi
export { setToken, logout } from "./slices/authSlice";

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
