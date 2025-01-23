import { commentApi } from "../../../entities/comment/api/commentApi";
import { CommentFormProps } from "../../../entities/types";
import { useState } from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Textarea,
  Button
} from "../../../shared/ui";

export const CommentForm = ({ 
  comment, 
  postId, 
  isOpen, 
  onClose, 
  onSuccess 
}: CommentFormProps) => {
  const [body, setBody] = useState(comment?.body || "");

  const handleSubmit = async () => {
    try {
      if (comment) {
        await commentApi.updateComment(comment.id, body);
      } else {
        await commentApi.createComment({
          body,
          postId,
          userId: 1,
          likes: 0
        });
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to save comment:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {comment ? "댓글 수정" : "새 댓글 추가"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="댓글 내용"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          <Button onClick={handleSubmit}>
            {comment ? "댓글 업데이트" : "댓글 추가"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};