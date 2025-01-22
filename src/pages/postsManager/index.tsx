import { PostDashboard } from "../../widgets/postDashboard";
import { PostForm } from "../../features/postManagement/ui/postForm";
import { usePostManagementStore } from "../../features/postManagement/model/store";
import { PostFormState } from "../../entities/types";

export const PostsManagerPage = () => {
  const {
    selectedPost,
    showAddDialog,
    showEditDialog,
    setShowAddDialog,
    setShowEditDialog,
    fetchPosts,
    addPost,
    updatePost
  } = usePostManagementStore();

  const handleAddPostSuccess = (formData: PostFormState) => {
    addPost(formData);
    fetchPosts();
    setShowAddDialog(false);
  };

  const handleEditPostSuccess = (formData: PostFormState) => {
    if (!selectedPost) return;

    const updatedPost = {
      id: selectedPost.id,
      title: formData.title,
      body: formData.body,
      userId: formData.userId,
      tags: formData.tags,
      // 기존 정보 유지
      reactions: selectedPost.reactions,
      author: selectedPost.author
    };

    updatePost(updatedPost);
    fetchPosts();
    setShowEditDialog(false);
  };

  return (
    <div>
      <PostDashboard />
      
      <PostForm
        isOpen={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onSuccess={handleAddPostSuccess}
      />

      <PostForm
        {...(selectedPost && { post: selectedPost })}
        isOpen={showEditDialog}
        onClose={() => setShowEditDialog(false)}
        onSuccess={handleEditPostSuccess}
      />
    </div>
  );
};