import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "api/baseUrl";

interface RegistrationData {
  tempToken: string;
  password: string;
  nameService: string;
  webAddress: string;
  startOfWork: string;
  endOfWork: string;
  telephoneNumber: string;
  city: string;
  address: string;
  services: string[];
}

interface RegistrationResponse {
  service: any;
}

const registerAutoServiceApi = createApi({
  reducerPath: "registerAutoServiceApi",
  baseQuery: fetchBaseQuery({ baseUrl: baseUrl }),
  endpoints: (builder) => ({
    registerService: builder.mutation<RegistrationResponse, RegistrationData>({
      query: (data) => ({
        url: "/service/registrationAutoService",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useRegisterServiceMutation } = registerAutoServiceApi;
export default registerAutoServiceApi;