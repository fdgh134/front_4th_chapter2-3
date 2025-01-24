import { apiClient } from "../../../shared/api";

export const userApi = {
  getById: async (id: number) => {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },

  getAll: async (params: { limit: number; select?: string }) => {
    const response = await apiClient.get("/users", { query: params });
    return response.data;
  }
};