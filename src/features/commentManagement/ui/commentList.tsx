import { CommentListProps, Comment, User, Post } from "../../../entities/types";
import { useState, useEffect } from "react";
import { ThumbsUp, Edit2, Trash2 } from "lucide-react";
import { CommentForm } from "./commentForm";
import { UserCard } from "../../../entities/user/ui/userCard";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button
} from "../../../shared/ui";

export const CommentList = ({postId, 
  onCommentUpdate, 
  onCommentDelete, 
  onCommentLike, 
  onCommentEdit 
 }: CommentListProps & {
  onCommentDelete?: (commentId: number) => void;
  onCommentLike?: (comment: Comment) => void;
  onCommentEdit?: (comment: Comment) => void;
 }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isPostDetailDialogOpen, setIsPostDetailDialogOpen] = useState(false);
 
  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/comments/post/${postId}`);
      const data = await response.json();
      setComments(data.comments);
    } catch (error) {
      console.error("댓글 불러오기 실패:", error);
    }
  };
 
  useEffect(() => {
    fetchComments();
  }, [postId]);
 
  const openUserModal = async (user: User) => {
    try {
      const response = await fetch(`/api/users/${user.id}`);
      const userData = await response.json();
      setSelectedUser(userData);
      setIsUserModalOpen(true);
    } catch (error) {
      console.error("사용자 정보 가져오기 실패:", error);
    }
  };
 
  const handleEditComment = (comment: Comment) => {
    setSelectedComment(comment);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="space-y-4">
     {comments.map((comment) => (
       <div key={comment.id} className="flex justify-between items-center p-2 border-b">
        <div 
          className="flex-grow cursor-pointer" 
          onClick={() => openUserModal(comment.user)}
        >
          <span className="font-medium">
            {comment.user.username}:{" "}
          </span>
          <span>{comment.body}</span>
         </div>
         <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onCommentLike?.(comment)}
          >
            <ThumbsUp className="w-4 h-4" />
            <span className="ml-1">{comment.likes}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onCommentEdit?.(comment);
              handleEditComment(comment);
            }}
          >
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onCommentDelete?.(comment.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
         </div>
      </div>
    ))}

     {selectedComment && (
       <CommentForm
         comment={selectedComment}
         postId={postId}
         isOpen={isEditDialogOpen}
         onClose={() => {
           setIsEditDialogOpen(false);
           setSelectedComment(null);
         }}
         onSuccess={() => {
           fetchComments();
           onCommentUpdate();
         }}
       />
     )}

     {selectedUser && (
       <Dialog open={isUserModalOpen} onOpenChange={setIsUserModalOpen}>
         <DialogContent>
           <UserCard user={selectedUser} />
         </DialogContent>
       </Dialog>
     )}

     {selectedPost && (
       <Dialog 
         open={isPostDetailDialogOpen} 
         onOpenChange={() => {
           setIsPostDetailDialogOpen(false);
           setSelectedPost(null);
         }}
       >
         <DialogContent className="max-w-3xl">
           <DialogHeader>
             <DialogTitle>{selectedPost.title}</DialogTitle>
           </DialogHeader>
           <div className="space-y-4">
             <p>{selectedPost.body}</p>
             <div className="mt-4">
               <h3 className="text-lg font-semibold mb-2">작성자 정보</h3>
               <div className="flex items-center space-x-2">
                 <img 
                   src={selectedPost.author?.image} 
                   alt={selectedPost.author?.username} 
                   className="w-10 h-10 rounded-full" 
                 />
                 <span>{selectedPost.author?.username}</span>
               </div>
             </div>
             <div className="mt-4">
               <h3 className="text-lg font-semibold mb-2">태그</h3>
               <div className="flex flex-wrap gap-2">
                 {selectedPost.tags?.map((tag) => (
                   <span 
                     key={tag} 
                     className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm"
                   >
                     {tag}
                   </span>
                 ))}
               </div>
             </div>
           </div>
         </DialogContent>
       </Dialog>
     )}
   </div>
 );
};