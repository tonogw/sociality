import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// import { persist, createJSONStorage } from "zustand/middleware";

// interface AuthState {
//   token: string | null;
//   isAuthenticated: boolean;
//   setToken: (token: string | null) => void;
//   logout: () => void;
// }

interface AuthState {
  token: string | null;
}

const initialState: AuthState = {
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
};

// export const useAuthStore = create<AuthState>()(
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
    },
    logout: (state) => {
      state.token = null;
      if (typeof window !== "undefined") localStorage.removeItem("token");
    },
  },
});

export const { setToken, logout } = authSlice.actions;
export default authSlice.reducer;
