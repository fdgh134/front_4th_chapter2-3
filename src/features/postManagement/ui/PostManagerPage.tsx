import React, { useState } from "react";
import { usePostContext } from "../model/postContext";
import { usePostActions } from "../model/postActions";
import { useUserActions } from "../../userManagement/model/userActions";
import { useCommentActions } from "../../commentManagement/model/commentActions";
import { PostDashboard } from "../../../widgets/postDashboard";
import { PostForm } from "./postForm";
import { PostDetailDialog } from "./postDetailDialog";
import { UserModal } from "../../userManagement/ui/UserModal";
import { CommentList } from "../../commentManagement/ui/commentList";

const PostsManagerPage: React.FC = () => {
  const { state, dispatch } = usePostContext();
  const postActions = usePostActions();
  const userActions = useUserActions();
  const commentActions = useCommentActions();

  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);

  const handlePostDetail = async (postId: number) => {
    try {
      const postData = await postActions.getPostById(postId);
      dispatch({ type: "SET_SELECTED_POST", payload: postData });
      setShowDetailDialog(true);
    } catch (error) {
      console.error("게시물 상세 정보 가져오기 실패:", error);
    }
  };

  const handleAddPostSuccess = (formData) => {
    postActions.addPost(formData);
    setShowAddDialog(false);
  };

  const handleEditPostSuccess = (formData) => {
    if (!state.selectedPost) return;
    const updatedPost = {
      ...state.selectedPost,
      ...formData
    };
    postActions.updatePost(updatedPost);
    setShowEditDialog(false);
  };

  const handleUserClick = async (user) => {
    await userActions.getUserById(user.id);
    setShowUserModal(true);
  };

  const handleCommentDelete = async (commentId: number) => {
    await commentActions.deleteComment(commentId, state.selectedPost?.id);
  };

  const handleCommentLike = async (comment) => {
    await commentActions.updateCommentLikes(comment);
  };

  return (
    <div>
      <PostDashboard 
        onPostDetail={handlePostDetail} 
        onUserClick={handleUserClick}
      />

      {state.selectedPost && (
        <CommentList 
          postId={state.selectedPost.id}
          onCommentDelete={handleCommentDelete}
          onCommentLike={handleCommentLike}
        />
      )}

      <PostForm
        isOpen={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onSuccess={handleAddPostSuccess}
      />

      {state.selectedPost && (
        <PostForm
          post={state.selectedPost}
          isOpen={showEditDialog}
          onClose={() => setShowEditDialog(false)}
          onSuccess={handleEditPostSuccess}
        />
      )}

      {state.selectedPost && (
        <PostDetailDialog
          post={state.selectedPost}
          isOpen={showDetailDialog}
          onClose={() => setShowDetailDialog(false)}
        />
      )}

      <UserModal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
      />
    </div>
  );
};

export default PostsManagerPage;