import { apiClient } from "../../../shared/api";
import { Comment, NewComment } from "../model/types";

export const commentApi = {
  getByPostId: async (postId: number) => {
    const response = await apiClient.get<{ comments: Comment[] }>(
      `/comments/post/${postId}`
    );
    return response.data;
  },

  create: async (comment: NewComment) => {
    const response = await apiClient.post<Comment>("/comments/add", comment);
    return response.data;
  },

  update: async (id: number, body: string) => {
    const response = await apiClient.put<Comment>(`/comments/${id}`, { body });
    return response.data;
  },

  delete: async (id: number) => {
    await apiClient.delete(`/comments/${id}`);
  },

  like: async (id: number, likes: number) => {
    const response = await apiClient.patch<Comment>(`/comments/${id}`, { likes });
    return response.data;
  }
};