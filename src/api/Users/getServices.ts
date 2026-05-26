import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "api/baseUrl";

export const servicesApi = createApi({
  reducerPath: "servicesApi",
  baseQuery: fetchBaseQuery({ baseUrl: baseUrl }), 
  endpoints: (builder) => ({
    getServices: builder.query<any, void>({
      query: () => "user/getServices", 
    }),
  }),
});

export const { useGetServicesQuery } = servicesApi;
