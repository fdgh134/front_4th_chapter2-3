import { ThumbsUp, ThumbsDown, MessageSquare, Edit2, Trash2 } from "lucide-react";
import { useState } from "react";
import { PostTableProps } from "../../../entities/types";
import { postApi } from "../../../entities/post/api/postApi";
import { usePostManagementStore } from "../../../features/postManagement/model/store";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Button
} from "../../../shared/ui";

const highlightText = (text: string, highlight: string) => {
  if (!text) return null;
  if (!highlight.trim()) {
    return <span>{text}</span>;
  }
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

export const PostTable = ({
  posts,
  highlight,
  onEdit,
  onDelete,
  onDetailView,
  onUserClick,
}: PostTableProps) => {
  const { fetchPosts } = usePostManagementStore();
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const handleTagClick = (tag: string) => {
    setSelectedTag((prevTag) => (prevTag === tag ? null : tag)); // 같은 태그 클릭 시 토글
  };

  const handleDelete = async (id: number) => {
    try {
      await postApi.deletePost(id);
      await fetchPosts();
      onDelete(id);
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px] text-center">ID</TableHead>
          <TableHead className="w-[600px]">내용</TableHead>
          <TableHead className="w-[120px] text-center">작성자</TableHead>
          <TableHead className="w-[100px] text-center">반응</TableHead>
          <TableHead className="w-[100px] text-center">작업</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts.map((post) => (
          <TableRow key={post.id} className="hover:bg-gray-50">
            <TableCell className="text-center">{post.id}</TableCell>
            <TableCell>
              <div className="flex flex-col gap-1">
                <div className="font-medium">{highlightText(post.title, highlight)}</div>
                <div className="flex flex-wrap gap-1">
                  {post.tags?.map((tag) => (
                    <span
                      key={tag}
                      onClick={() => handleTagClick(tag)}
                      className={`
                        px-2 py-0.5 text-xs font-medium rounded-full cursor-pointer
                        ${selectedTag === tag 
                          ? "bg-blue-500 text-white hover:bg-blue-600"
                          : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                        }
                      `}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div 
                className="flex items-center justify-center gap-2 cursor-pointer" 
                onClick={() => onUserClick?.(post.author)}
              >
                <img
                  src={post.author?.image}
                  alt={post.author?.username}
                  className="w-8 h-8 rounded-full"
                />
                <span>{post.author?.username}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center justify-center gap-3">
                <div className="flex items-center gap-1">
                  <ThumbsUp className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{post.reactions?.likes || 0}</span>
                </div>
                <div className="flex items-center gap-1">
                  <ThumbsDown className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{post.reactions?.dislikes || 0}</span>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center justify-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDetailView(post)}
                  className="p-1"
                >
                  <MessageSquare className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(post)}
                  className="p-1"
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(post.id)}
                  className="p-1"
                >
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