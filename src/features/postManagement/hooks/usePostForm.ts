import { useState, useCallback } from "react";
import { PostFormState, PostFilters, PaginationParams } from "../../../entities/types";
import { usePostActions } from "../../../entities/post/model/usePostActions";
import { usePostManagement } from "../model/postContext";

export const usePostForm = (initialData?: Partial<PostFormState>) => {
  const [formData, setFormData] = useState<PostFormState>({
    title: initialData?.title ?? "",
    body: initialData?.body ?? "",
    tags: initialData?.tags ?? [],
    userId: initialData?.userId ?? 1,
  });

  const { dispatch } = usePostManagement();
  const { fetchPosts } = usePostActions();

  const handleSubmit = useCallback(async (id?: number) => {
    try {
      if (id) {
        // 수정
        const response = await fetch(`/api/posts/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (!response.ok) throw new Error("Failed to update post");
      } else {
        // 생성
        const response = await fetch("/api/posts/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (!response.ok) throw new Error("Failed to create post");
      }

      // 성공 시 목록 새로고침
      const params: PostFilters & PaginationParams = {
        skip: 0,
        limit: 10,
        search: "",
        tag: "",
        sortBy: "",
        sortOrder: "asc"
      };
      
      await fetchPosts(params);
      dispatch({ type: "SET_ADD_DIALOG_OPEN", payload: false });
      dispatch({ type: "SET_EDIT_DIALOG_OPEN", payload: false });

    } catch (error) {
      console.error("Failed to save post:", error);
      throw error;
    }
  }, [formData, dispatch, fetchPosts]);

  return {
    formData,
    setFormData,
    handleSubmit,
  };
};