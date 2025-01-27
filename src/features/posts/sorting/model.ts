import { usePostStore } from "../../../entities/posts";
import { Post } from "../../../entities/posts";
import { useCallback } from "react";

type SortOrder = "asc" | "desc";
type SortBy = "id" | "title" | "reactions" | "none";

export const usePostSorting = () => {
  const { posts, setPosts } = usePostStore();

  const sortPosts = useCallback((sortBy: SortBy, sortOrder: SortOrder) => {
    if (sortBy === "none") return posts;

    const sortedPosts = [...posts].sort((a: Post, b: Post) => {
      switch (sortBy) {
        case "id":
          return sortOrder === "asc" ? a.id - b.id : b.id - a.id;
        
        case "title":
          return sortOrder === "asc" 
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title);
        
        case "reactions":
          const aReactions = (a.reactions?.likes || 0) - (a.reactions?.dislikes || 0);
          const bReactions = (b.reactions?.likes || 0) - (b.reactions?.dislikes || 0);
          return sortOrder === "asc" ? aReactions - bReactions : bReactions - aReactions;
        
        default:
          return 0;
      }
    });

    setPosts(sortedPosts);
    return sortedPosts;
  }, [posts, setPosts]);

  return { sortPosts };
};