import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  Input, 
  Textarea, 
  Button 
} from "../../../shared/ui";

interface AddPostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (post: { title: string; body: string; userId: number }) => void;
}

export const AddPostModal = ({ open, onOpenChange, onSubmit }: AddPostModalProps) => {
  const [newPost, setNewPost] = useState({ title: "", body: "", userId: 1 });
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 게시물 추가</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="제목"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          />
          <Textarea
            placeholder="내용"
            value={newPost.body}
            onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
            rows={15}
          />
          <Input
            type="number"
            placeholder="사용자 ID"
            value={newPost.userId}
            onChange={(e) => setNewPost({ ...newPost, userId: Number(e.target.value) })}
          />
          <Button onClick={() => onSubmit(newPost)}>게시물 추가</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
