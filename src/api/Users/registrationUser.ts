import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "api/baseUrl"; // Предположим, что baseUrl определен

export const registrationUserApi = createApi({
  reducerPath: "registrationUserApi", // Название редьюсера
  baseQuery: fetchBaseQuery({ baseUrl }), // Базовый URL
  endpoints: (builder) => ({
    // Мутация для регистрации пользователя
    registerUser: builder.mutation({
      query: (userData) => ({
        url: "/user/registrationUser", // Путь к API регистрации
        method: "POST",
        body: userData, // Передача данных пользователя в теле запроса
      }),
    }),
  }), 
});

// Экспортируем сгенерированные хуки
export const { useRegisterUserMutation } = registrationUserApi;
