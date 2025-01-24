import { apiClient } from "../../../shared/api";
import { Tag } from "../model/types";

export const tagApi = {
  getAll: async () => {
    const response = await apiClient.get<Tag[]>("/posts/tags");
    return response.data;
  }
};