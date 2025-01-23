import { PostDetailDialogProps } from "../../../entities/types";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "../../../shared/ui"

export const PostDetailDialog = ({ post, isOpen, onClose }: PostDetailDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{post.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>{post.body}</p>
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">작성자 정보</h3>
            <div className="flex items-center space-x-2">
              <img src={post.author?.image} alt={post.author?.username} className="w-10 h-10 rounded-full" />
              <span>{post.author?.username}</span>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">태그</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags?.map((tag) => (
                <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};