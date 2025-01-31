import { Post } from "../../../entities/posts";
import { User } from "../../../entities/users";
import { ThumbsUp, ThumbsDown, MessageSquare, Edit2, Trash2 } from "lucide-react";
import { apiClient } from "../../../shared/api";
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
  selectedTag?: string;
  onEditClick: (post: Post) => void;
  onDeleteClick: (id: number) => void;
  onPostClick: (post: Post) => void;
  onUserClick: (user: User) => void;
  onTagClick?: (tag: string) => void;
}

export const PostsTable = ({
  posts,
  searchQuery,
  selectedTag,
  onEditClick,
  onDeleteClick,
  onPostClick,
  onUserClick,
  onTagClick
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

  const handleUserClick = async (userId: number) => {
    try {
      const response = await apiClient.get<User>(`/users/${userId}`);
      onUserClick(response.data);
    } catch (error) {
      console.error("사용자 정보 가져오기 오류:", error);
    }
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
              <div className="space-y-1">
                <div>{highlightText(post.title, searchQuery || '')}</div>
                <div className="flex flex-wrap gap-1">
                  {post.tags?.map((tag) => (
                    <span
                      key={tag}
                      className={`px-1 text-[9px] font-semibold rounded-[4px] cursor-pointer ${
                        selectedTag === tag
                          ? "text-white bg-blue-500 hover:bg-blue-600"
                          : "text-blue-800 bg-blue-100 hover:bg-blue-200"
                      }`}
                      onClick={() => onTagClick?.(tag)}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div 
                className="flex items-center space-x-2 cursor-pointer" 
                onClick={() => handleUserClick(post.userId)}
              >
                <img 
                  src={`https://robohash.org/${post.userId}.png`}
                  alt={`User ${post.userId}`}
                  className="w-8 h-8 rounded-full" 
                />
                <span>User {post.userId}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <ThumbsUp className="w-4 h-4" />
                <span>
                  {typeof post.reactions === 'number' 
                    ? post.reactions 
                    : post.reactions.likes}
                </span>
                <ThumbsDown className="w-4 h-4" />
                <span>
                  {typeof post.reactions === 'number' 
                    ? 0 
                    : post.reactions.dislikes}
                </span>
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