import { createSlice } from "@reduxjs/toolkit";
import { ACCESS_TOKEN } from "@/constants";
import type { IAuthUser } from "@/types";

interface IinitialState {
  token: string | null;
  authUser: IAuthUser | null;
}

const initialState: IinitialState = {
  token: localStorage.getItem(ACCESS_TOKEN) || null,
  authUser: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    SignIn: (state, action) => {
      state.token = action.payload;
      localStorage.setItem(ACCESS_TOKEN, action.payload);
    },
    SignOut: (state) => {
      state.token = null;
      localStorage.removeItem(ACCESS_TOKEN);
    },
    SetAuthUser: (state, action) => {
      state.authUser = action.payload;
    },
  },
});

export const { SignIn, SignOut, SetAuthUser } = authSlice.actions;

export default authSlice.reducer;