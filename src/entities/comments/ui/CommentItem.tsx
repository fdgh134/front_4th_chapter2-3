import { Button } from "../../../shared/ui";
import { ThumbsUp, Edit2, Trash2 } from "lucide-react";
import type { Comment } from "../model/types";

interface CommentItemProps {
  comment: Comment;
  onLike: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const CommentItem = ({ comment, onLike, onEdit, onDelete }: CommentItemProps) => {
  return (
    <div className="flex items-center justify-between text-sm border-b pb-1">
      <div className="flex items-center space-x-2 overflow-hidden">
        <span className="font-medium truncate">{comment.user.username}:</span>
        <span className="truncate">{comment.body}</span>
      </div>
      <div className="flex items-center space-x-1">
        <Button variant="ghost" size="sm" onClick={onLike}>
          <ThumbsUp className="w-3 h-3" />
          <span className="ml-1 text-xs">{comment.likes}</span>
        </Button>
        <Button variant="ghost" size="sm" onClick={onEdit}>
          <Edit2 className="w-3 h-3" />
        </Button>
        <Button variant="ghost" size="sm" onClick={onDelete}>
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
};