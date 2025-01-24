import { apiClient } from "../../../shared/api";
import { User } from "../model/types";

export const userApi = {
  getById: async (id: number) => {
    const response = await apiClient.get<User>(`/users/${id}`);
    return response.data;
  },

  getAll: async (params: { limit: number; select?: string }) => {
    const response = await apiClient.get<{ users: User[] }>(
      '/users',
      { query: params }
    );
    return response.data;
  }
};