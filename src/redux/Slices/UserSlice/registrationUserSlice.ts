import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  login: string;
  password: string;
  user?: any;
  service?: any;
}

const initialState: UserState = {
  login: "",
  password: "",
  user: null,
  service: null,
};

const registrationUserSlice = createSlice({
  name: "registrationUserSlice",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserState>) {
      state.login = action.payload.login;
      state.password = action.payload.password;
    },
    setUserData(state, action: PayloadAction<any>) {
      state.user = action.payload;
      state.service = null;
    },
    setServiceData(state, action: PayloadAction<any>) {
      state.service = action.payload;
      state.user = null;
    },
    clearUser(state) {
      state.login = "";
      state.password = "";
      state.user = null;
      state.service = null;
    },
  },
});

export const { setUser, clearUser, setUserData, setServiceData } = registrationUserSlice.actions;
export default registrationUserSlice.reducer;