import { usePostStore } from "../../../entities/posts";
import { useCallback } from "react";
import { postApi } from "../../../entities/posts";
import { Post } from "../../../entities/posts";

export const usePostCard = () => {
  const { addPost, updatePost: updateStorePost, removePost } = usePostStore();

  const createPost = useCallback(async (post: Omit<Post, "id">) => {
    try {
      const newPost = await postApi.create(post);
      addPost(newPost);
      return newPost;
    } catch (error) {
      console.error("게시물 생성 오류:", error);
      throw error;
    }
  }, [addPost]);

  const updatePost = useCallback(async (id: number, post: Partial<Post>) => {
    try {
      const updatedPost = await postApi.update(id, post);
      updateStorePost(id, updatedPost);
      return updatedPost;
    } catch (error) {
      console.error("게시물 수정 오류:", error);
      throw error;
    }
  }, [updateStorePost]);

  const deletePost = useCallback(async (id: number) => {
    try {
      await postApi.delete(id);
      removePost(id);
    } catch (error) {
      console.error("게시물 삭제 오류:", error);
      throw error;
    }
  }, [removePost]);

  return { createPost, updatePost, deletePost };
};