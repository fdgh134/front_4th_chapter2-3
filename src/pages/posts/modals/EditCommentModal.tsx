import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, Textarea, Button } from "../../../shared/ui";
import { useCommentFeatures } from "../../../features/comments/model";
import { IComment } from "../../../entities/comments";

interface EditCommentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  comment: IComment | null;
}

export const EditCommentModal = ({ open, onOpenChange, comment }: EditCommentModalProps) => {
  const [body, setBody] = useState("");
  const { updateComment } = useCommentFeatures();

  useEffect(() => {
    if (comment) {
      setBody(comment.body);
    }
  }, [comment]);

  const handleSubmit = async () => {
    if (!comment) return;
    
    try {
      await updateComment(comment.id, body);
      onOpenChange(false);
    } catch (error) {
      console.error("댓글 수정 오류:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>댓글 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="댓글 내용"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          <Button onClick={handleSubmit}>댓글 수정</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};