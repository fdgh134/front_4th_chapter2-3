import { create } from "zustand";
import { Tag } from "./types";

interface TagState {
  tags: Tag[];
  selectedTag: string | null;
  loading: boolean;
  setTags: (tags: Tag[]) => void;
  setSelectedTag: (tag: string | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useTagStore = create<TagState>((set => ({
  tags: [],
  selectedTag: null,
  loading: false,
  setTags: (tags) => set({ tags }),
  setSelectedTag: (tag) => set({ selectedTag: tag }),
  setLoading: (loading) => set({ loading })
})));