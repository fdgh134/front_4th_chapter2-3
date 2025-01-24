import { useState } from "react"
import { CommentEditFormProps } from "../../../entities/types"
import { 
  Dialog, 
  DialogContent,
  DialogHeader, 
  DialogTitle, 
  Textarea, 
  Button 
} from "../../../shared/ui"


export const CommentEditForm = ({ comment, isOpen, onClose, onSuccess }: CommentEditFormProps) => {
  const [editedComment, setEditedComment] = useState(comment.body)

  const handleSubmit = () => {
    onSuccess({ ...comment, body: editedComment })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>댓글 수정</DialogTitle>
        </DialogHeader>
        <Textarea
          value={editedComment}
          onChange={(e) => setEditedComment(e.target.value)}
          placeholder="댓글 내용"
        />
        <Button onClick={handleSubmit}>수정 완료</Button>
      </DialogContent>
    </Dialog>
  )
}