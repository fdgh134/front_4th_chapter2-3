import { AppError, handleError } from "../lib/utils/errorHelper";
import { createQueryString } from "../lib/utils/urlHelper";
import { ApiResponse } from "./types";
import { CONFIG } from '../config';

interface RequestOptions extends RequestInit {
  query?: Record<string, string | number | boolean | undefined>;
}

const request = async <T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> => {
  const url = new URL(`${CONFIG.API.BASE_URL}${endpoint}`);
  
  if (options?.query) {
    url.search = createQueryString(options.query);
  }

  try {
    const response = await fetch(url.toString(), {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new AppError(
        "API request failed",
        "API_ERROR",
        response.status
      );
    }

    const data = await response.json();
    return { data, status: response.status };
  } catch (error) {
    throw handleError(error);
  }
};

export const apiClient = {
  get: <T>(endpoint: string, options?: Omit<RequestOptions, "body">) => 
    request<T>(endpoint, { ...options, method: "GET" }),

  post: <T>(endpoint: string, data: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(data),
    }),

  put: <T>(endpoint: string, data: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: "PUT", 
      body: JSON.stringify(data),
    }),

  patch: <T>(endpoint: string, data: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  delete: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: "DELETE" }),
};