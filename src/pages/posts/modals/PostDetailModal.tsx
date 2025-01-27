import { useState, useEffect } from "react";
import { Post } from "../../../entities/posts";
import { CommentItem } from "../../../entities/comments";
import { Plus } from "lucide-react";
import { useCommentFeatures } from "../../../features/comments/model";
import { useCommentStore } from "../../../entities/comments";
import { AddCommentModal } from "./AddCommentModal";
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
  const [showAddComment, setShowAddComment] = useState(false);
  const { comments } = useCommentStore();
  const { fetchComments, likeComment, deleteComment } = useCommentFeatures();

  useEffect(() => {
    if (post?.id) {
      fetchComments(post.id);
    }
  }, [post?.id, fetchComments]);

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

  const handleLikeComment = (commentId: number) => {
    const comment = comments[post.id]?.find(c => c.id === commentId);
    if (comment) {
      likeComment(commentId, post.id, comment.likes);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{highlightText(post.title, searchQuery || '')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>{highlightText(post.body, searchQuery || '')}</p>
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold">댓글</h3>
                <Button size="sm" onClick={() => setShowAddComment(true)}>
                  <Plus className="w-3 h-3 mr-1" />
                  댓글 추가
                </Button>
              </div>
              {comments[post.id] && (
                <CommentItem
                  comments={comments[post.id]}
                  onLike={handleLikeComment}
                  onDelete={(commentId) => deleteComment(commentId, post.id)}
                  onEdit={() => {}} // TODO: 댓글 수정 기능 구현
                />
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AddCommentModal
        open={showAddComment}
        onOpenChange={setShowAddComment}
        postId={post.id}
      />
  </>
  );
};