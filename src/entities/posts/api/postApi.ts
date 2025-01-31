import { apiClient } from "../../../shared/api"
import { Post, PostsResponse } from "../model/types";
import { User } from "../../users";

export const postApi = {
  getAll: async (params: { limit: number; skip: number }) => {
    const response = await apiClient.get<{ posts: Post[]; users: User[]; total: number }>(
      "/posts",
      { query: params }
    );

    // posts에 user 정보를 매핑
    const postsWithUsers = response.data.posts.map(post => {
      const user = response.data.users.find(u => u.id === post.userId);
      return {
        ...post,
        author: user ? {
          id: user.id,
          username: user.username,
          image: user.image,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          address: user.address,
          company: user.company
        } : undefined
      };
    });

    return {
      posts: postsWithUsers,
      total: response.data.total,
      skip: params.skip,
      limit: params.limit
    };
  },

  getByTag: async (tag: string) => {
    // posts와 users 데이터를 동시에 가져옴
    const [postsResponse, usersResponse] = await Promise.all([
      tag === "all"
        ? apiClient.get<PostsResponse>("/posts", { query: { limit: 10, skip: 0 } })
        : apiClient.get<PostsResponse>("/posts/search", { query: { q: tag } }),
      // dummyjson API에서 users 정보 가져오기
      apiClient.get<{ users: User[] }>("/users")
    ]);
  
    // posts에 user 정보를 매핑
    const postsWithUsers = postsResponse.data.posts.map(post => {
      const user = usersResponse.data.users.find(u => u.id === post.userId);
      return {
        ...post,
        author: user ? {
          id: user.id,
          username: user.username,
          image: user.image,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          address: user.address,
          company: user.company
        } : undefined
      };
    });
  
    return {
      posts: postsWithUsers,
      total: postsResponse.data.total,
      skip: postsResponse.data.skip,
      limit: postsResponse.data.limit
    };
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