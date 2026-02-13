import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios";
import { getCookie, removeCookie } from "./utils";

interface FetcherOptions extends Omit<AxiosRequestConfig, "url"> {
  isAuth?: boolean;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "",
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": true,
  },
});

export const serverFetcher = async <T = unknown>(
  url: string,
  options: FetcherOptions = {},
): Promise<T> => {
  const { isAuth = false, ...restOptions } = options;

  try {
    const config: AxiosRequestConfig = {
      url,
      ...restOptions,
    };

    if (isAuth) {
      if (restOptions.headers?.Authorization) {
        config.headers = {
          ...config.headers,
          ...restOptions.headers,
        };
      }
    }

    const response: AxiosResponse<T> = await api(config);
    return response.data;
  } catch (error) {
    console.error("Server fetcher error:", error);
    throw error;
  }
};

export const clientFetcher = async <T = unknown>(
  url: string,
  options: FetcherOptions = {},
): Promise<T> => {
  const { isAuth = false, ...restOptions } = options;

  try {
    const config: AxiosRequestConfig = {
      url,
      ...restOptions,
    };

    if (isAuth) {
      const token = getCookie("token");

      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        };
      }
    }

    const response: AxiosResponse<T> = await api(config);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      removeCookie("token");
      window.location.href = "/login";
    }
    throw error;
  }
};

export const serverGet = <T = unknown>(
  url: string,
  isAuth = false,
): Promise<T> => {
  return serverFetcher<T>(url, { method: "GET", isAuth });
};

export const serverPost = <T = unknown>(
  url: string,
  data: unknown,
  isAuth = false,
): Promise<T> => {
  return serverFetcher<T>(url, { method: "POST", data, isAuth });
};

export const serverPut = <T = unknown>(
  url: string,
  data: unknown,
  isAuth = false,
): Promise<T> => {
  return serverFetcher<T>(url, { method: "PUT", data, isAuth });
};

export const serverDel = <T = unknown>(
  url: string,
  isAuth = false,
): Promise<T> => {
  return serverFetcher<T>(url, { method: "DELETE", isAuth });
};

export const clientGet = <T = unknown>(
  url: string,
  isAuth = false,
): Promise<T> => {
  return clientFetcher<T>(url, { method: "GET", isAuth });
};

export const clientPost = <T = unknown>(
  url: string,
  data: unknown,
  isAuth = false,
): Promise<T> => {
  return clientFetcher<T>(url, { method: "POST", data, isAuth });
};

export const clientPut = <T = unknown>(
  url: string,
  data: unknown,
  isAuth = false,
): Promise<T> => {
  return clientFetcher<T>(url, { method: "PUT", data, isAuth });
};

export const clientDel = <T = unknown>(
  url: string,
  isAuth = false,
): Promise<T> => {
  return clientFetcher<T>(url, { method: "DELETE", isAuth });
};

export const serverFetcherWithToken = async <T = unknown>(
  url: string,
  token: string,
  options: Omit<FetcherOptions, "isAuth"> = {},
): Promise<T> => {
  return serverFetcher<T>(url, {
    ...options,
    isAuth: true,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });
};

export default api;
