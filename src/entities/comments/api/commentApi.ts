import { apiClient } from "../../../shared/api";

export const commentApi = {
  getByPostId: async (postId: number) => {
    const response = await apiClient.get(`/comments/post/${postId}`);
    return response.data;
  },

  create: async (comment: Omit<Comment, 'id' | 'user'>) => {
    const response = await apiClient.post('/comments/add', comment);
    return response.data;
  },

  update: async (id: number, body: string) => {
    const response = await apiClient.put(`/comments/${id}`, { body });
    return response.data;
  },

  delete: async (id: number) => {
    await apiClient.delete(`/comments/${id}`);
  },

  like: async (id: number, likes: number) => {
    const response = await apiClient.patch(`/comments/${id}`, { likes });
    return response.data;
  }
};