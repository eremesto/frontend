import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ServiceTypeState {
  type: string;
}

const initialState: ServiceTypeState = {
  type: "user", // Изначальное значение
};

const authTypeSlice = createSlice({
  name: "serviceType",
  initialState,
  reducers: {
    setAuthType(state, action: PayloadAction<string>) {
      state.type = action.payload; // Изменяем значение type на переданное
    },
    clearAuthType(state) {
      state.type = ""; // Очищаем значение
    },
  },
});

export const { setAuthType, clearAuthType } = authTypeSlice.actions;
export default authTypeSlice.reducer;
