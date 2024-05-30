import axios, { AxiosHeaderValue, AxiosInstance } from "axios";
import axiosClient, { BASE_URL } from "./axios";
import toast from "react-hot-toast";

interface RawAxiosHeaders {
  [key: string]: AxiosHeaderValue;
}

interface AxiosHeader {
  headers?: RawAxiosHeaders;
}

interface AxiosType extends AxiosHeader {}

function axiosInstance({ headers }: AxiosType) {
  const headersConfig = {
    baseURL: BASE_URL,
    Accept: "application/json",
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    ...headers,
  };

  const instance = axios.create({
    baseURL: BASE_URL,
    timeout: 300000,
    headers: headersConfig,
  });

  instance.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  });

  instance.interceptors.response.use(
    (response) => {
      return response.data;
    },
    async (error) => {
      const preRequest = error?.config;

      if (error?.response?.status === 401 && !preRequest?.sent) {
        const refreshToken = localStorage.getItem("refresh_token");

        const clearTokenStorage = () => {
          localStorage.setItem("access_token", "");
          localStorage.setItem("refresh_token", "");
        };

        const reCallApi = (token: string) => {
          if (token) {
            preRequest.headers["Authorization"] = `Bearer ${token}`;

            return instance(preRequest);
          }
        };

        try {
          const res = await axiosClient.post("/auth/refresh", {
            refreshToken: refreshToken,
          });
          if (res.data.access_token) {
            const newToken = res.data.access_token;
            localStorage.setItem("access_token", newToken);
            return reCallApi(newToken);
          } else {
            clearTokenStorage();
          }
        } catch (error: any) {
          if (error.response.status === 403) {
            if (refreshToken) {
              toast.error("User has expired");
              clearTokenStorage();
            }
          }
        }
      } else if (error?.response?.status !== 200) {
        toast.error("Internal Server");
      }
      return Promise.reject(error);
    }
  );

  return instance;
}

export const axiosAuth = axiosInstance({});
export const axiosFormData = axiosInstance({
  headers: {
    "Content-Type": "multipart/form-data",
  },
});
