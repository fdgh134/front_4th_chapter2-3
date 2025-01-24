import { useTagStore } from "../../../entities/tags";
import { usePostStore } from "../../../entities/posts";
import { useCallback } from "react";
import { postApi } from "../../../entities/posts";

export const usePostTag = () => {
  const { setLoading, setPosts, setTotal } = usePostStore();
  const { setSelectedTag } = useTagStore();

  const fetchPostsTag = useCallback(async (tag: string) => {
    setLoading(true);
    try{
      const data = await postApi.getByTag(tag);
      setPosts(data.posts);
      setTotal(data.total);
      setSelectedTag(tag);
    } catch (error) {
      console.error("태그별 게시물 가져오기 오류:", error);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setPosts, setTotal, setSelectedTag]);

  return { fetchPostsTag };
};