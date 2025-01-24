import { useCommentStore } from "../../entities/comments";
import { useCallback } from "react";
import { commentApi } from "../../entities/comments";
import { Comment } from "../../entities/comments";

export const useCommentFeatures = () => {
  const { 
    setComments,
    addComment: addStoreComment,
    updateComment: updateStoreComment,
    removeComment,
    incrementLikes,
    setLoading
  } = useCommentStore();

  const fetchComments = useCallback(async (postId: number) => {
    setLoading(true);

    try {
      const data = await commentApi.getByPostId(postId);
      setComments(postId, data.comments);
    } catch (error) {
      console.error("댓글 가져오기 오류:", error);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setComments]);

  const addComment = useCallback(async (comment: Omit<Comment, "id" | "user">) => {
    try {
      const newComment = await commentApi.create(comment);
      addStoreComment(newComment);
      return newComment;
    } catch (error) {
      console.error("댓글 추가 오류:", error);
      throw error;
    }
  }, [addStoreComment]);

  const updateComment = useCallback(async (id: number, body: string) => {
    try {
      const updateComment = await commentApi.update(id, body);
      updateStoreComment(updateComment);
      return updateComment;
    } catch (error) {
      console.error("댓글 수정 오류:", error);
      throw error;
    }
  }, [updateStoreComment]);

  const deleteComment = useCallback(async (id: number, postId: number) => {
    try {
      await commentApi.delete(id);
      removeComment(id, postId);
    } catch (error) {
      console.error("댓글 삭제 오류:", error);
      throw error;
    }
  }, [removeComment]);

  const likeComment = useCallback(async (id: number, postId: number, currentLikes: number) => {
    try {
      await commentApi.like(id, currentLikes + 1);
      incrementLikes(id, postId);
    } catch (error) {
      console.error("댓글 좋아요 오류:", error);
      throw error;
    }
  }, [incrementLikes]);

  return {
    fetchComments,
    addComment,
    updateComment,
    deleteComment,
    likeComment
  }
};