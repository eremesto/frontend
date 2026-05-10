import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "api/baseUrl";

export const loginAutoServiceApi = createApi({
  reducerPath: "autoServiceApi",
  baseQuery: fetchBaseQuery({ baseUrl: baseUrl }),
  endpoints: (builder) => ({
    loginAutoService: builder.mutation({
      query: (credentials) => ({
        url: "/service/loginAutoService",
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});

// Экспортируем с правильным именем
export const { useLoginAutoServiceMutation } = loginAutoServiceApi;
