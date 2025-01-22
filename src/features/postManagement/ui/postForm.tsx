import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, Input, Textarea, Button } from "../../../shared/ui";
import { Post, PostFormState } from "../../../entities/types";
import { postApi } from "../../../entities/post/api/postApi";

interface PostFormProps {
  post?: Post | undefined;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (formData: PostFormState) => void;
}

export const PostForm = ({ post, isOpen, onClose, onSuccess }: PostFormProps) => {
  const [formData, setFormData] = useState({
    title: post?.title || "",
    body: post?.body || "",
    userId: post?.userId || 1,
  });

  const handleSubmit = async () => {
    try {
      if (post) {
        await postApi.updatePost(post.id, formData);
      } else {
        await postApi.createPost(formData);
      }
      onSuccess(formData);
      onClose();
    } catch (error) {
      console.error("오류 발생:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{post ? "게시물 수정" : "새 게시물 추가"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="제목"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <Textarea
            placeholder="내용"
            value={formData.body}
            rows={15}
            onChange={(e) => setFormData({ ...formData, body: e.target.value })}
          />
          <Button onClick={handleSubmit}>
            {post ? "게시물 수정" : "게시물 추가"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};