import { usePostContext } from "./postContext";
import { postApi } from "../../../entities/post/api/postApi";

export const usePostActions = () => {
  const { state, dispatch } = usePostContext();

  const fetchPosts = async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const [postsResponse, usersResponse] = await Promise.all([
        fetch(`/api/posts?limit=${state.limit}&skip=${state.skip}`).then(res => res.json()),
        fetch("/api/users?limit=0&select=username,image").then(res => res.json())
      ]);

      const postsWithUsers = postsResponse.posts.map((post: any) => ({
        ...post,
        author: usersResponse.users.find((user: any) => user.id === post.userId)
      }));

      dispatch({ type: "SET_POSTS", payload: postsWithUsers });
      dispatch({ type: "SET_TOTAL", payload: postsResponse.total });
    } catch (error) {
      console.error("게시물 가져오기 오류:", error);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const addPost = async (newPost: any) => {
    try {
      const response = await fetch("/api/posts/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost)
      });
      const data = await response.json();
      
      dispatch({ 
        type: "SET_POSTS", 
        payload: [data, ...state.posts] 
      });
      
      return data;
    } catch (error) {
      console.error("게시물 추가 오류:", error);
    }
  };

  const updatePost = async (post: any) => {
    try {
      const response = await fetch(`/api/posts/${post.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(post)
      });
      const updatedPost = await response.json();
      
      dispatch({ 
        type: "SET_POSTS", 
        payload: state.posts.map(p => p.id === updatedPost.id ? updatedPost : p)
      });
      
      return updatedPost;
    } catch (error) {
      console.error("게시물 업데이트 오류:", error);
    }
  };

  const deletePost = async (id: number) => {
    try {
      await fetch(`/api/posts/${id}`, { method: "DELETE" });
      
      dispatch({ 
        type: "SET_POSTS", 
        payload: state.posts.filter(p => p.id !== id)
      });
    } catch (error) {
      console.error("게시물 삭제 오류:", error);
    }
  };

  const fetchComments = async (postId: number) => {
    try {
      const response = await fetch(`/api/comments/post/${postId}`);
      const data = await response.json();
      
      dispatch({ 
        type: "SET_COMMENTS", 
        payload: { postId, comments: data.comments }
      });
    } catch (error) {
      console.error("댓글 가져오기 오류:", error);
    }
  };

  const getPostById = async (id: number) => {
    try {
      const post = await postApi.getPostById(id);
      return post;
    } catch (error) {
      console.error("게시물 불러오기 오류:", error);
      return null;
    }
  };

  return {
    fetchPosts,
    addPost,
    updatePost,
    deletePost,
    fetchComments,
    getPostById
  };
};