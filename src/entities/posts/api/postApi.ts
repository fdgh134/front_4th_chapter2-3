import { apiClient } from "../../../shared/api"
import { Post } from "../model/types";

export const postApi = {
  getAll: async (params: { limit: number; skip: number }) => {
    const response = await apiClient.get('/posts', { query: params });
    return response.data;
  },

  getByTag: async (tag: string) => {
    const response = await apiClient.get(`/posts/tag/${tag}`);
    return response.data;
  },

  search: async (query: string) => {
    const response = await apiClient.get(`/posts/search?q=${query}`);
    return response.data;
  },

  create: async (post: Omit<Post, 'id'>) => {
    const response = await apiClient.post('/posts/add', post);
    return response.data;
  },

  update: async (id: number, post: Partial<Post>) => {
    const response = await apiClient.put(`/posts/${id}`, post);
    return response.data;
  },

  delete: async (id: number) => {
    await apiClient.delete(`/posts/${id}`);
  }
};