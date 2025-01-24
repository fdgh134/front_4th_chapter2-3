import { create } from "zustand";
import { Post } from "./types";

interface PostState {
  posts: Post[];
  total: number;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  setPosts: (posts: Post[]) => void;
  setTotal: (total: number) => void;
  addPost: (post: Post) => void;
  updatePost: (id: number, post: Partial<Post>) => void;
  removePost: (id: number) => void;
}

export const usePostStore = create<PostState>((set) => ({
  posts: [],
  total: 0,
  loading: true,
  setLoading: (loading) => set({ loading }),
  setPosts: (posts) => set({ posts }),
  setTotal: (total) => set({ total }),
  addPost: (post) => set((state) => ({
    posts: [post, ...state.posts],
    total: state.total + 1
  })),
  updatePost: (id, updatedPost) => set((state) => ({
    posts: state.posts.map((post) =>
      post.id === id ? { ...post, ...updatedPost } : post
    )
  })),
  removePost: (id) => set((state) => ({
    posts: state.posts.filter((post) => post.id !== id),
    total: state.total - 1
  }))
}));