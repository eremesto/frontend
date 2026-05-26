import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "api/baseUrl";

export const registrationUserApi = createApi({
  reducerPath: "registrationUserApi", 
  baseQuery: fetchBaseQuery({ baseUrl }), 
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (userData) => ({
        url: "/user/registrationUser", 
        method: "POST",
        body: userData, 
      }),
    }),
  }), 
});

export const { useRegisterUserMutation } = registrationUserApi;
