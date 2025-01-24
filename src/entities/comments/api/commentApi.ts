import { apiClient } from "../../../shared/api";
import { Comment, CommentResponse } from '../../types';

export const commentApi = {
  // 댓글 조회
  getCommentsByPostId: (postId: number) =>
    apiClient.get<CommentResponse>(`/api/comments/post/${postId}`),

  getCommentById: (id: number) =>
    apiClient.get<Comment>(`/api/comments/${id}`),

  // 댓글 생성/수정/삭제
  createComment: (comment: Omit<Comment, 'id' | 'user'>) =>
    apiClient.post<Comment>('/api/comments/add', comment),

  updateComment: (id: number, body: string) =>
    apiClient.put<Comment>(`/api/comments/${id}`, { body }),

  deleteComment: (id: number) =>
    apiClient.delete(`/api/comments/${id}`),
  
  // 댓글 좋아요
  updateLikes: (id: number, data: { likes: number; userId?: number }) =>
    apiClient.patch<Comment>(`/api/comments/${id}`, data)
};