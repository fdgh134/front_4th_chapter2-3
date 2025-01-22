import { create } from "zustand";
import { postApi } from "../api/postApi";
import { 
  Post, 
  PostApiResponse, 
  PostFilters, 
  PaginationParams, 
  PostFormState 
} from "../../../entities/types";

interface PostManagementStore {
  selectedPost: Post | null;
  showAddDialog: boolean;
  showEditDialog: boolean;

  posts: Post[];
  total: number;
  loading: boolean;
  filters: PostFilters;
  pagination: PaginationParams;

  setSelectedPost: (post: Post | null) => void;
  setShowAddDialog: (show: boolean) => void;
  setShowEditDialog: (show: boolean) => void;

  fetchPosts: () => Promise<void>;
  addPost: (post: PostFormState) => Promise<void>;
  updatePost: (post: Post) => Promise<void>;
  deletePost: (id: number) => Promise<void>;
  
  setFilters: (filters: Partial<PostFilters>) => void;
  setPagination: (pagination: Partial<PaginationParams>) => void;
  
  updateURL: () => void;
  resetFilters: () => void;
}

export const usePostManagementStore = create<PostManagementStore>((set, get) => ({
  selectedPost: null,
  showAddDialog: false,
  showEditDialog: false,

  posts: [],
  total: 0,
  loading: false,
  filters: {
    search: '',
    tag: '',
    sortBy: 'none',
    sortOrder: 'asc'
  },
  pagination: {
    skip: 0,
    limit: 10
  },

  setSelectedPost: (post) => set({ selectedPost: post }),
  setShowAddDialog: (show) => set({ showAddDialog: show }),
  setShowEditDialog: (show) => set({ showEditDialog: show }),

  fetchPosts: async () => {
    set({ loading: true });
    try {
      const { filters, pagination } = get();
      const response: PostApiResponse = await postApi.getPosts({
        ...pagination,
        ...filters
      });
      
      set({ 
        posts: response.posts, 
        total: response.total,
        loading: false 
      });
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      set({ loading: false });
    }
  },

  addPost: async (post) => {
    try {
      const newPost = await postApi.createPost(post);
      const currentPosts = get().posts;
      set({ 
        posts: [newPost, ...currentPosts],
        showAddDialog: false
      });
    } catch (error) {
      console.error('Failed to add post:', error);
    }
  },

  updatePost: async (post) => {
    try {
      const updatedPost = await postApi.updatePost(post.id, post);
      const currentPosts = get().posts;
      set({ 
        posts: currentPosts.map(p => p.id === post.id ? updatedPost : p),
        showEditDialog: false,
        selectedPost: null
      });
    } catch (error) {
      console.error('Failed to update post:', error);
    }
  },

  deletePost: async (id) => {
    try {
      await postApi.deletePost(id);
      const currentPosts = get().posts;
      set({ 
        posts: currentPosts.filter(p => p.id !== id)
      });
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  },

  setFilters: (filters) => {
    set(state => ({ 
      filters: { ...state.filters, ...filters },
      pagination: { ...state.pagination, skip: 0 } // 필터 변경 시 첫 페이지로
    }));
    get().fetchPosts();
    get().updateURL();
  },

  setPagination: (pagination) => {
    set(state => ({ 
      pagination: { ...state.pagination, ...pagination }
    }));
    get().fetchPosts();
    get().updateURL();
  },

  updateURL: () => {
    const { filters, pagination } = get();
    const searchParams = new URLSearchParams();

    // 필터 파라미터 추가
    if (filters.search) searchParams.set('search', filters.search);
    if (filters.tag) searchParams.set('tag', filters.tag);
    if (filters.sortBy !== 'none') {
      searchParams.set('sortBy', filters.sortBy);
      searchParams.set('sortOrder', filters.sortOrder);
    }

    // 페이지네이션 파라미터 추가
    if (pagination.skip > 0) searchParams.set('skip', pagination.skip.toString());
    if (pagination.limit !== 10) searchParams.set('limit', pagination.limit.toString());

    // URL 업데이트
    window.history.pushState({}, '', `?${searchParams.toString()}`);
  },

  resetFilters: () => {
    set({
      filters: {
        search: '',
        tag: '',
        sortBy: 'none',
        sortOrder: 'asc'
      },
      pagination: {
        skip: 0,
        limit: 10
      }
    });
    get().fetchPosts();
    get().updateURL();
  }
}));