import { apiClient } from "../../../shared/api"
import { Post } from "../model/types";

export const postApi = {
  getAll: async (params: { limit: number; skip: number }) => {
    const response = await apiClient.get<{ posts: Post[]; total: number }>(
      "/posts",
      { query: params }
    );
    console.log("API Response:", response.data);
    return response.data;
  },

  getByTag: async (tag: string) => {
    if (tag === "all") {
      return apiClient.get<{ posts: Post[]; total: number }>(
        "/posts",
        { query: { limit: 10, skip: 0 } }
      ).then(res => res.data);
    }
    
    const response = await apiClient.get<{ posts: Post[]; total: number }>(
      `/posts/search`,
      { query: { q: tag } }  // 태그를 검색어로 사용
    );
    return response.data;
  },

  search: async (query: string) => {
    const response = await apiClient.get<{ posts: Post[]; total: number }>(
      `/posts/search`,
      { query: { q: query } }
    );
    return response.data;
  },

  create: async (post: Omit<Post, "id">) => {
    const response = await apiClient.post<Post>("/posts/add", post);
    return response.data;
  },

  update: async (id: number, post: Partial<Post>) => {
    const response = await apiClient.put<Post>(`/posts/${id}`, post);
    return response.data;
  },

  delete: async (id: number) => {
    await apiClient.delete(`/posts/${id}`);
  }
};