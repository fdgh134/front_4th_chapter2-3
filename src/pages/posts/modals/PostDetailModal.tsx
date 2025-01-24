import { Post } from "../../../entities/posts";
import { CommentItem } from "../../../entities/comments";
import { Plus } from "lucide-react";
import { useCommentFeatures } from "../../../features/comments/model";
import { useCommentStore } from "../../../entities/comments";
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle, 
  Button 
} from "../../../shared/ui";

interface PostDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: Post | null;
  searchQuery?: string;
}

export const PostDetailModal = ({ open, onOpenChange, post, searchQuery }: PostDetailModalProps) => {
  const { comments } = useCommentStore();
  const { likeComment, deleteComment } = useCommentFeatures();

  if (!post) return null;

  const highlightText = (text: string, highlight: string) => {
    if (!highlight?.trim() || !text) return text;
    const regex = new RegExp(`(${highlight})`, "gi");
    const parts = text.split(regex);
    return (
      <span>
        {parts.map((part, i) => (
          regex.test(part) ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>
        ))}
      </span>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{highlightText(post.title, searchQuery || '')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>{highlightText(post.body, searchQuery || '')}</p>
          {comments[post.id] && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold">댓글</h3>
                <Button size="sm">
                  <Plus className="w-3 h-3 mr-1" />
                  댓글 추가
                </Button>
              </div>
              <CommentItem
                comments={comments[post.id]}
                onLike={(commentId) => {
                  const comment = comments[post.id].find(c => c.id === commentId);
                  if (comment) {
                    likeComment(commentId, post.id, comment.likes);
                  }
                }}
                onEdit={() => {}}
                onDelete={(commentId) => deleteComment(commentId, post.id)}
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};