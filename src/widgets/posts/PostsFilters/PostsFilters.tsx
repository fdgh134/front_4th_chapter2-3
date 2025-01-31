import { useEffect, useState } from "react";
import { apiClient } from "../../../shared/api";
import { Input, Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "../../../shared/ui"
import { Search } from "lucide-react";

interface PostsFiltersProps {
  searchQuery: string;
  selectedTag: string;
  sortBy: "id" | "title" | "reactions" | "none";
  sortOrder: "asc" | "desc";
  onSearchChange: (value: string) => void;
  onTagChange: (value: string) => void;
  onSortByChange: (value: "id" | "title" | "reactions" | "none") => void;
  onSortOrderChange: (value: "asc" | "desc") => void;
  onSearch: () => void;
}

export const PostsFilters = ({
  searchQuery,
  selectedTag,
  sortBy,
  sortOrder,
  onSearchChange,
  onTagChange,
  onSortByChange,
  onSortOrderChange,
  onSearch
}: PostsFiltersProps) => {
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await apiClient.get<{ posts: Array<{ tags: string[] }> }>('/posts', { 
          query: { limit: 100 } 
        });
        
        // 모든 게시물의 태그를 추출하고 중복 제거
        const allTags = [...new Set(response.data.posts.flatMap(post => post.tags))];
        setTags(allTags);
      } catch (error) {
        console.error("태그 가져오기 오류:", error);
      }
    };

    fetchTags();
  }, []);

  return (
    <div className="flex gap-4">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="게시물 검색..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && onSearch()}
          />
        </div>
      </div>
      <Select value={selectedTag} onValueChange={onTagChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="태그 선택" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">모든 태그</SelectItem>
          {tags.map((tag) => (
            <SelectItem key={tag} value={tag}>
              {tag}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={sortBy} onValueChange={onSortByChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="정렬 기준" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">없음</SelectItem>
          <SelectItem value="id">ID</SelectItem>
          <SelectItem value="title">제목</SelectItem>
          <SelectItem value="reactions">반응</SelectItem>
        </SelectContent>
      </Select>
      <Select value={sortOrder} onValueChange={onSortOrderChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="정렬 순서" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="asc">오름차순</SelectItem>
          <SelectItem value="desc">내림차순</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};