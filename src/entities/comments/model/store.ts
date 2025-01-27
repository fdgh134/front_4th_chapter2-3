import { create } from "zustand";
import { IComment } from "./types";

interface CommentState {
  comments: Record<number, IComment[]>;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  setComments: (postId: number, comments: IComment[]) => void;
  addComment: (comment: IComment) => void;
  updateComment: (comment: IComment) => void;
  removeComment: (commentId: number, postId: number) => void;
  incrementLikes: (commentId: number, postId: number) => void;
}

export const useCommentStore = create<CommentState>((set) => ({
  comments: {},
  loading: false,
  setLoading: (loading) => set({ loading }),
  setComments: (postId, comments) => 
    set((state) => ({ 
      comments: { ...state.comments, [postId]: comments } 
    })),
  addComment: (comment) => 
    set((state) => ({
      comments: {
        ...state.comments,
        [comment.postId]: [
          ...(state.comments[comment.postId] || []),
          comment
        ]
      }
    })),
  updateComment: (updatedComment) =>
    set((state) => ({
      comments: {
        ...state.comments,
        [updatedComment.postId]: state.comments[updatedComment.postId].map(
          comment => comment.id === updatedComment.id ? updatedComment : comment
        )
      }
    })),
  removeComment: (commentId, postId) =>
    set((state) => ({
      comments: {
        ...state.comments,
        [postId]: state.comments[postId].filter(
          comment => comment.id !== commentId
        )
      }
    })),
  incrementLikes: (commentId, postId) =>
    set((state) => ({
      comments: {
        ...state.comments,
        [postId]: state.comments[postId].map(comment =>
          comment.id === commentId 
            ? { ...comment, likes: comment.likes + 1 }
            : comment
        )
      }
    }))
}));