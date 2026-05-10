import { configureStore } from "@reduxjs/toolkit";
import { loginUserApi } from "api/Users/loginUser"; // API для аутентификации
import { servicesApi } from "api/Users/getServices";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import registrationUserSlice from "./Slices/UserSlice/registrationUserSlice";
import authTypeSlice from "./authTypeSlice";
import { registrationUserApi } from "api/Users/registrationUser";
import registerAutoServiceApi from "api/AutoService/registrationAutoService";
import { loginAutoServiceApi } from "api/AutoService/loginAutoService";

export const store = configureStore({
  reducer: {
    [loginUserApi.reducerPath]: loginUserApi.reducer, // Аутентификация API
    [servicesApi.reducerPath]: servicesApi.reducer, // API для услуг
    [registrationUserApi.reducerPath]: registrationUserApi.reducer, // Регистрация пользователя API
    [registerAutoServiceApi.reducerPath]: registerAutoServiceApi.reducer,
    [loginAutoServiceApi.reducerPath]: loginAutoServiceApi.reducer,

    registrationUser: registrationUserSlice, // Редьюсер регистрации пользователя
    registrationType: authTypeSlice, // Тип регистрации
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(loginUserApi.middleware) // Middleware для Auth API
      .concat(servicesApi.middleware) // Middleware для Services API
      .concat(registrationUserApi.middleware) // Middleware для регистрации
      .concat(registerAutoServiceApi.middleware)
      .concat(loginAutoServiceApi.middleware),
});

// Типизация состояния Redux
export type RootState = ReturnType<typeof store.getState>;
export const useAppDispatch = () => useDispatch<typeof store.dispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
