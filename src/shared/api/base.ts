import { AppError, handleError } from "../lib/utils/errorHelper";
import { createQueryString } from "../lib/utils/urlHelper";
import { ApiResponse } from "./types";

interface RequestOptions extends RequestInit {
  query?: Record<string, string | number | boolean | null | undefined>;
}

async function request<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
  try {
    const url = endpoint.startsWith('/api') 
      ? endpoint
      : `/api${endpoint}`;
    
    let finalUrl = url;
    if (options?.query) {
      const filteredQuery = Object.fromEntries(
        Object.entries(options.query)
          .filter(([_, value]) => value !== null && value !== undefined)
          .map(([key, value]) => [key, String(value)])
      ) as Record<string, string>;
      
      finalUrl += `?${createQueryString(filteredQuery)}`;
    }

    const response = await fetch(finalUrl, {
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
}

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