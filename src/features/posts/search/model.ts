import { usePostStore } from "../../../entities/posts";
import { useCallback } from "react";
import { postApi } from "../../../entities/posts";

export const usePostSearch = () => {
  const { setLoading, setPosts, setTotal } = usePostStore();

  const searchPosts = useCallback(async (query: string) => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const data = await postApi.search(query);
      setPosts(data.posts);
      setTotal(data.total);
    } catch (error) {
      console.error("게시물 검색 오류:", error);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setPosts, setTotal]);

  return { searchPosts };
};