import { useState } from "react";
import { useCommentFeatures } from "../../../features/comments/model";
import { NewComment } from "../../../entities/comments";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Textarea,
  Button
} from "../../../shared/ui";

interface AddCommentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  postId: number;
}

export const AddCommentModal = ({ open, onOpenChange, postId }: AddCommentModalProps) => {
  const [body, setBody] = useState("");
  const { addComment } = useCommentFeatures();

  const handleSubmit = async () => {
    try {
      const newComment: NewComment = { 
        body, 
        postId, 
        userId: 1,
        };
        await addComment(newComment);
        setBody("");
        onOpenChange(false);
    } catch (error) {
      console.error("댓글 추가 오류:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 댓글 추가</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="댓글 내용"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          <Button onClick={handleSubmit}>댓글 추가</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
