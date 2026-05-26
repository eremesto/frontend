import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ServiceTypeState {
  type: string;
}

const initialState: ServiceTypeState = {
  type: "user", 
};

const authTypeSlice = createSlice({
  name: "serviceType",
  initialState,
  reducers: {
    setAuthType(state, action: PayloadAction<string>) {
      state.type = action.payload; 
    },
    clearAuthType(state) {
      state.type = ""; 
    },
  },
});

export const { setAuthType, clearAuthType } = authTypeSlice.actions;
export default authTypeSlice.reducer;
