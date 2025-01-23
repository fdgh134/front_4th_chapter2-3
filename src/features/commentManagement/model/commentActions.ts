import { commentApi } from "../../../entities/comment/api/commentApi";
import { useCommentContext } from "./commentContext";

export const useCommentActions = () => {
  const { state, dispatch } = useCommentContext();

  const fetchCommentsByPostId = async (postId: number) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await commentApi.getCommentsByPostId(postId);
      dispatch({ 
        type: 'SET_COMMENTS', 
        payload: { postId, comments: response.comments }
      });
      dispatch({ type: 'SET_TOTAL', payload: response.total });
    } catch (error) {
      console.error("댓글 불러오기 오류:", error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const createComment = async (comment: any) => {
    try {
      const newComment = await commentApi.createComment(comment);
      const postId = newComment.postId;
      
      const currentComments = state.commentsByPostId[postId] || [];
      dispatch({ 
        type: 'SET_COMMENTS', 
        payload: { 
          postId, 
          comments: [...currentComments, newComment] 
        }
      });
      
      return newComment;
    } catch (error) {
      console.error("댓글 생성 오류:", error);
    }
  };

  const updateComment = async (id: number, body: string) => {
    try {
      const updatedComment = await commentApi.updateComment(id, body);
      const postId = updatedComment.postId;
      
      dispatch({ 
        type: 'SET_COMMENTS', 
        payload: { 
          postId, 
          comments: state.commentsByPostId[postId].map(
            comment => comment.id === id ? updatedComment : comment
          )
        }
      });
      
      return updatedComment;
    } catch (error) {
      console.error("댓글 업데이트 오류:", error);
    }
  };

  const deleteComment = async (id: number, postId: number) => {
    try {
      await commentApi.deleteComment(id);
      
      dispatch({ 
        type: 'SET_COMMENTS', 
        payload: { 
          postId, 
          comments: state.commentsByPostId[postId].filter(comment => comment.id !== id)
        }
      });
    } catch (error) {
      console.error("댓글 삭제 오류:", error);
    }
  };

  return {
    fetchCommentsByPostId,
    createComment,
    updateComment,
    deleteComment
  };
};