import { Button } from "../../../shared/ui";
import { ThumbsUp, Edit2, Trash2 } from "lucide-react";
import { Comment } from "../model/types";

interface CommentItemProps {
  comments: Comment[];
  onLike: (commentId: number) => void;
  onEdit: (comment: Comment) => void;
  onDelete: (commentId: number) => void;
}

export const CommentItem = ({ comments, onLike, onEdit, onDelete }: CommentItemProps) => {
  return (
    <div className="space-y-2">
    {comments.map(comment => (
      <div key={comment.id} className="flex items-center justify-between text-sm border-b pb-2">
        <div className="flex items-center space-x-2 overflow-hidden">
          <span className="font-medium truncate">{comment.user.username}:</span>
          <span className="truncate">{comment.body}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onLike(comment.id)}
          >
            <ThumbsUp className="w-3 h-3" />
            <span className="ml-1 text-xs">{comment.likes}</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onEdit(comment)}
          >
            <Edit2 className="w-3 h-3" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onDelete(comment.id)}
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>
    ))}
  </div>
  );
};