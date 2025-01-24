import { usePostStore } from "../../entities/posts";
import { useCommentStore } from "../../entities/comments";
import { useUserStore } from "../../entities/users";
import { useTagStore } from "../../entities/tags";

export const useStore = () => ({
  posts: usePostStore(),
  comments: useCommentStore(),
  users: useUserStore(),
  tags: useTagStore()
});

export type RootStore = ReturnType<typeof useStore>;
export type PostStore = ReturnType<typeof usePostStore>;
export type CommentStore = ReturnType<typeof useCommentStore>;
export type UserStore = ReturnType<typeof useUserStore>;
export type TagStore = ReturnType<typeof useTagStore>;