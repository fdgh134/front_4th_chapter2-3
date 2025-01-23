import { apiClient } from "../../../shared/api";
import { Post, PostFilters, PaginationParams, PostsResponse, TagsResponse } from "../../types";

export const postApi = {
  // 게시물 조회
  getPosts: (params: PaginationParams & PostFilters) => 
    apiClient.get<PostsResponse>(
      `/api/posts?${new URLSearchParams({
        limit: params.limit.toString(),
        skip: params.skip.toString(),
        sortBy: params.sortBy,
        sortOrder: params.sortOrder,
      }).toString()}`
    ),

  getPostById: (id: number) =>
    apiClient.get<Post>(`/api/posts/${id}`),

  searchPosts: (query: string) =>
    apiClient.get<PostsResponse>(`/api/posts/search?q=${query}`),

  getPostsByTag: (tag: string) =>
    apiClient.get<PostsResponse>(`/api/posts/tag/${tag}`),

  getTags: () =>
    apiClient.get<TagsResponse>("/api/posts/tags"),

  // 게시물 생성/수정/삭제
  createPost: (post: Omit<Post, "id">) =>
    apiClient.post<Post>("/api/posts/add", post),

  updatePost: (id: number, post: Partial<Post>) =>
    apiClient.put<Post>(`/api/posts/${id}`, post),

  deletePost: (id: number) =>
    apiClient.delete(`/api/posts/${id}`),

  // 게시물 반응
  updateReactions: (id: number, reactions: Post["reactions"]) =>
    apiClient.patch<Post>(`/api/posts/${id}/reactions`, reactions),

  // 사용자별 게시물
  getPostsByUser: (userId: number) =>
  apiClient.get<PostsResponse>(`/api/posts/user/${userId}`),

  // 댓글 관련
  getComments: (postId: number) =>
    apiClient.get<PostsResponse>(`/api/posts/${postId}/comments`),

  addComment: (postId: number, comment: { body: string; userId: number }) =>
    apiClient.post<Comment>(`/api/posts/${postId}/comments`, comment),

  // 태그 관련
  addTag: (postId: number, tag: string) =>
    apiClient.post<Post>(`/api/posts/${postId}/tags`, { tag }),

  removeTag: (postId: number, tag: string) =>
    apiClient.delete(`/api/posts/${postId}/tags/${tag}`),

  // 상세 조회
  getPostWithComments: async (postId: number) => {
    const [post, comments] = await Promise.all([
      postApi.getPostById(postId),
      postApi.getComments(postId)
    ]);
    return { ...post, comments };
  }
};