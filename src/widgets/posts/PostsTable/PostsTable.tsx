import { Post } from "../../../entities/posts";
import { User, UserBadge } from "../../../entities/users";
import { ThumbsUp, ThumbsDown, MessageSquare, Edit2, Trash2 } from "lucide-react";
import { 
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Button
} from "../../../shared/ui";

interface PostsTableProps {
  posts: Post[];
  searchQuery?: string;
  onEditClick: (post: Post) => void;
  onDeleteClick: (id: number) => void;
  onPostClick: (post: Post) => void;
  onUserClick: (user: User) => void;
}

export const PostsTable = ({
  posts,
  searchQuery,
  onEditClick,
  onDeleteClick,
  onPostClick,
  onUserClick
}: PostsTableProps) => {
  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim() || !text) return text;
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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">ID</TableHead>
          <TableHead>제목</TableHead>
          <TableHead className="w-[150px]">작성자</TableHead>
          <TableHead className="w-[150px]">반응</TableHead>
          <TableHead className="w-[150px]">작업</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts.map((post) => (
          <TableRow key={post.id}>
            <TableCell>{post.id}</TableCell>
            <TableCell>
              {highlightText(post.title, searchQuery || '')}
            </TableCell>
            <TableCell>
              {post.author && (
                <UserBadge 
                  user={post.author} 
                  onClick={() => onUserClick(post.author!)}
                />
              )}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <ThumbsUp className="w-4 h-4" />
                <span>{post.reactions?.likes || 0}</span>
                <ThumbsDown className="w-4 h-4" />
                <span>{post.reactions?.dislikes || 0}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => onPostClick(post)}>
                  <MessageSquare className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onEditClick(post)}>
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onDeleteClick(post.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};