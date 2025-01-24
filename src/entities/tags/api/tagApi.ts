import { apiClient } from "../../../shared/api";

export const tagApi = {
  getAll: async () => {
    const response = await apiClient.get("/posts/tags");
    return response.data;
  }
};