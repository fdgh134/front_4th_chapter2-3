import { Post } from "../../../entities/posts";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  Input, 
  Textarea, 
  Button 
} from "../../../shared/ui";

interface EditPostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: Post | null;
  onSubmit: (post: Post) => void;
}

export const EditPostModal = ({ open, onOpenChange, post, onSubmit }: EditPostModalProps) => {
  if (!post) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>게시물 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="제목"
            value={post.title}
            onChange={(e) => onSubmit({ ...post, title: e.target.value })}
          />
          <Textarea
            placeholder="내용"
            value={post.body}
            onChange={(e) => onSubmit({ ...post, body: e.target.value })}
            rows={15}
          />
          <Button onClick={() => onOpenChange(false)}>게시물 업데이트</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};