import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "api/baseUrl";

export const servicesApi = createApi({
  reducerPath: "servicesApi",
  baseQuery: fetchBaseQuery({ baseUrl: baseUrl }), // Базовый URL вашего API
  endpoints: (builder) => ({
    getServices: builder.query<any, void>({
      query: () => "user/getServices", // Относительный URL для запроса
    }),
  }),
});

// Экспортируем хук для использования в компонентах
export const { useGetServicesQuery } = servicesApi;
