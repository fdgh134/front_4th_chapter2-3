import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, Button } from "../../shared/ui";
import { Plus } from "lucide-react";
import { useStore } from "../../app/store";
import { usePostTag } from "../../features/posts/tag/model";
import { usePostSearch } from "../../features/posts/search/model";
import { usePostCard } from "../../features/posts/card/model";
import { useUserFeatures } from "../../features/users/model";
import { PostsTable } from "../../widgets/posts/PostsTable/PostsTable";
import { PostsFilters } from "../../widgets/posts/PostsFilters/PostsFilters";
import { PostsPagination } from "../../widgets/posts/PostsPagination/PostsPagination";
import { Post } from "../../entities/posts";
import { User } from "../../entities/users";

const PostsManagerPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const store = useStore();
  const { posts, loading, total } = store.posts;
  const { tags } = store.tags;
  
  const { fetchPostsTag } = usePostTag();
  const { searchPosts } = usePostSearch();
  const { createPost, updatePost, deletePost } = usePostCard();
  const { fetchUserDetails } = useUserFeatures();

  // 로컬 스테이트
  const [skip, setSkip] = useState(parseInt(queryParams.get("skip") || "0"));
  const [limit, setLimit] = useState(parseInt(queryParams.get("limit") || "10"));
  const [searchQuery, setSearchQuery] = useState(queryParams.get("search") || "");
  const [sortBy, setSortBy] = useState(queryParams.get("sortBy") || "");
  const [sortOrder, setSortOrder] = useState(queryParams.get("sortOrder") || "asc");
  const [selectedTag, setSelectedTag] = useState(queryParams.get("tag") || "");
  
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showPostDetailDialog, setShowPostDetailDialog] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);

  // URL 업데이트
  const updateURL = () => {
    const params = new URLSearchParams();
    if (skip) params.set("skip", skip.toString());
    if (limit) params.set("limit", limit.toString());
    if (searchQuery) params.set("search", searchQuery);
    if (sortBy) params.set("sortBy", sortBy);
    if (sortOrder) params.set("sortOrder", sortOrder);
    if (selectedTag) params.set("tag", selectedTag);
    navigate(`?${params.toString()}`);
  };

  // 이벤트 핸들러
  const handleTagChange = (tag: string) => {
    setSelectedTag(tag);
    fetchPostsTag(tag);
    updateURL();
  };

  const handleSearch = () => {
    if (searchQuery) {
      searchPosts(searchQuery);
    }
  };

  const handleUserClick = async (user: User) => {
    await fetchUserDetails(user.id);
    setShowUserModal(true);
  };

  // 초기 데이터 로딩
  useEffect(() => {
    if (selectedTag) {
      fetchPostsTag(selectedTag);
    }
    updateURL();
  }, [skip, limit, sortBy, sortOrder, selectedTag]);

  // URL 파라미터 동기화
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSkip(parseInt(params.get("skip") || "0"));
    setLimit(parseInt(params.get("limit") || "10"));
    setSearchQuery(params.get("search") || "");
    setSortBy(params.get("sortBy") || "");
    setSortOrder(params.get("sortOrder") || "asc");
    setSelectedTag(params.get("tag") || "");
  }, [location.search]);

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>게시물 관리자</span>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            게시물 추가
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <PostsFilters
            searchQuery={searchQuery}
            selectedTag={selectedTag}
            sortBy={sortBy}
            sortOrder={sortOrder}
            tags={tags}
            onSearchChange={setSearchQuery}
            onTagChange={handleTagChange}
            onSortByChange={setSortBy}
            onSortOrderChange={setSortOrder}
            onSearch={handleSearch}
          />

          {loading ? (
            <div className="flex justify-center p-4">로딩 중...</div>
          ) : (
            <PostsTable
              posts={posts}
              searchQuery={searchQuery}
              onEditClick={(post) => {
                setSelectedPost(post);
                setShowEditDialog(true);
              }}
              onDeleteClick={(id) => deletePost(id)}
              onPostClick={(post) => {
                setSelectedPost(post);
                setShowPostDetailDialog(true);
              }}
              onUserClick={handleUserClick}
            />
          )}

          <PostsPagination
            skip={skip}
            limit={limit}
            total={total}
            onLimitChange={setLimit}
            onPrevPage={() => setSkip(Math.max(0, skip - limit))}
            onNextPage={() => setSkip(skip + limit)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PostsManagerPage;