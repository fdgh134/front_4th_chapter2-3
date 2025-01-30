import { apiClient } from "../../../shared/api"
import { Post } from "../model/types";

export const postApi = {
  getAll: async (params: { limit: number; skip: number }) => {
    const response = await apiClient.get<{ 
      posts: Post[]; 
      total: number 
    }>("/posts", { 
      query: { 
        limit: params.limit, 
        skip: params.skip 
      } 
    });
    
    // DummyJSON 응답 구조에 맞게 데이터 변환
    const postsWithMetadata = response.data.posts.map(post => ({
      ...post,
      tags: post.tags || [], // 태그가 없으면 빈 배열로 처리
      author: {
        id: post.userId,
        username: post.userId.toString(), // userId를 username으로 사용
        image: `https://i.pravatar.cc/150?u=${post.userId}` // 임시 프로필 이미지
      },
      reactions: {
        likes: post.reactions?.likes || 0,
        dislikes: post.reactions?.dislikes || 0
      }
    }));

    return {
      posts: postsWithMetadata,
      total: response.data.total
    };
  },

  getByTag: async (tag: string) => {
    if (tag === "all") {
      return postApi.getAll({ limit: 10, skip: 0 });
    }
    
    const response = await apiClient.get<{ 
      posts: Post[]; 
      total: number 
    }>("/posts/search", { 
      query: { q: tag } 
    });
    
    // 태그 기반 검색 결과 변환
    const postsWithMetadata = response.data.posts.map(post => ({
      ...post,
      tags: post.tags || [tag], // 검색된 태그 추가
      author: {
        id: post.userId,
        username: post.userId.toString(),
        image: `https://i.pravatar.cc/150?u=${post.userId}`
      },
      reactions: {
        likes: post.reactions?.likes || 0,
        dislikes: post.reactions?.dislikes || 0
      }
    }));

    return {
      posts: postsWithMetadata,
      total: response.data.total
    };
  },

  search: async (query: string) => {
    const response = await apiClient.get<{ 
      posts: Post[]; 
      total: number 
    }>("/posts/search", { 
      query: { q: query } 
    });
    
    // 검색 결과 변환
    const postsWithMetadata = response.data.posts.map(post => ({
      ...post,
      tags: post.tags || [], 
      author: {
        id: post.userId,
        username: post.userId.toString(),
        image: `https://i.pravatar.cc/150?u=${post.userId}`
      },
      reactions: {
        likes: post.reactions?.likes || 0,
        dislikes: post.reactions?.dislikes || 0
      }
    }));

    return {
      posts: postsWithMetadata,
      total: response.data.total
    };
  },

  create: async (post: Omit<Post, "id">) => {
    const response = await apiClient.post<Post>("/posts/add", {
      ...post,
      tags: post.tags || [],
      reactions: { likes: 0, dislikes: 0 }
    });
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