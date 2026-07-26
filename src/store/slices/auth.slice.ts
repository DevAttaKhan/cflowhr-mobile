import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { MOCK_USER } from "@/data/mocks/employee";
import type { AuthUser } from "@/types/auth";

type AuthState = {
  user: AuthUser | null;
  isLoggedIn: boolean;
};

const initialState: AuthState = {
  user: null,
  isLoggedIn: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginMock(state, action: PayloadAction<AuthUser | undefined>) {
      state.user = action.payload ?? MOCK_USER;
      state.isLoggedIn = true;
    },
    logout(state) {
      state.user = null;
      state.isLoggedIn = false;
    },
  },
});

export const { loginMock, logout } = authSlice.actions;
export const authReducer = authSlice.reducer;
