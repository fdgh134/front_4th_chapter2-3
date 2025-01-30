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
import { 
  AddPostModal, 
  EditPostModal, 
  PostDetailModal, 
  UserDetailModal 
} from "./modals";
import { usePostSorting } from "../../features/posts";
import { ErrorBoundary } from "../../shared/error/ErrorBoundary";
import { ErrorToast } from "../../shared/error/ErrorToast";
import { AppError } from "../../shared/lib";

const PostsManagerPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const store = useStore();
  const { posts, loading, total } = store.posts;
  const { tags } = store.tags;
  const { selectedUser } = store.users;
  
  const { fetchPostsTag } = usePostTag();
  const { searchPosts } = usePostSearch();
  const { createPost, updatePost, deletePost } = usePostCard();
  const { fetchUserDetails } = useUserFeatures();
  const { sortPosts } = usePostSorting();
  const [error, setError] = useState<AppError | null>(null);

  // URL 기반 상태
  const [skip, setSkip] = useState(parseInt(queryParams.get("skip") || "0"));
  const [limit, setLimit] = useState(parseInt(queryParams.get("limit") || "10"));
  const [searchQuery, setSearchQuery] = useState(queryParams.get("search") || "");
  const [sortBy, setSortBy] = useState<"id" | "title" | "reactions" | "none">(
    (queryParams.get("sortBy") as "id" | "title" | "reactions" | "none") || "none"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(
    (queryParams.get("sortOrder") as "asc" | "desc") || "asc"
  );
  const [selectedTag, setSelectedTag] = useState(queryParams.get("tag") || "");
  
  // 모달 상태
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showPostDetailDialog, setShowPostDetailDialog] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);

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

  const handleAddPost = async (post: Omit<Post, "id">) => {
    try {
      await createPost(post);
      setShowAddDialog(false);
    } catch (error) {
      handleError(error);
    }
  };

  const handleDeletePost = async (postId: number) => {
    try {
      await deletePost(postId);
    } catch (error) {
      handleError(error);
    }
  };

  const handleEditPost = async (post: Post) => {
    try {
      await updatePost(post.id, post);
      setShowEditDialog(false);
    } catch (error) {
      handleError(error);
    }
  };

  const handleLimitChange = (newLimit: number) => {
    try {
      setLimit(newLimit);
      updateURL();
    } catch (error) {
      handleError(error);
    }
  };

  const handlePrevPage = () => {
    try {
      setSkip(Math.max(0, skip - limit));
      updateURL();
    } catch (error) {
      handleError(error);
    }
  };

  const handleNextPage = () => {
    try {
      setSkip(skip + limit);
      updateURL();
    } catch (error) {
      handleError(error);
    }
  };

  const handleSortChange = (newSortBy: string, newSortOrder: "asc" | "desc") => {
    try {
      setSortBy(newSortBy as "id" | "title" | "reactions" | "none");
      setSortOrder(newSortOrder);
      sortPosts(newSortBy as "id" | "title" | "reactions" | "none", newSortOrder);
      updateURL();
    } catch (error) {
      handleError(error);
    }
  };

  const handleTagChange = (tag: string) => {
    try {
      setSelectedTag(tag);
      fetchPostsTag(tag);
      updateURL();
    } catch (error) {
      handleError(error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery) return;
    
    try {
      await searchPosts(searchQuery);
    } catch (error) {
      handleError(error);
    }
  };

  const handleUserClick = async (user: User) => {
    try {
      await fetchUserDetails(user.id);
      setShowUserModal(true);
    } catch (error) {
      handleError(error);
    }
  };

  const handleError = (error: unknown) => {
    if (error instanceof AppError) {
      setError(error);
    } else if (error instanceof Error) {
      setError(new AppError(error.message, "UNKNOWN_ERROR"));
    } else {
      setError(new AppError("알 수 없는 오류가 발생했습니다.", "UNKNOWN_ERROR"));
    }
  };

  useEffect(() => {
    if (selectedTag) {
      fetchPostsTag(selectedTag);
    }
    updateURL();
  }, [skip, limit, selectedTag]);

  // 정렬 상태가 변경될 때마다 정렬 적용
  useEffect(() => {
    if (sortBy !== "none") {
      sortPosts(sortBy as "id" | "title" | "reactions" | "none", sortOrder as "asc" | "desc");
    }
  }, [sortBy, sortOrder]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSkip(parseInt(params.get("skip") || "0"));
    setLimit(parseInt(params.get("limit") || "10"));
    setSearchQuery(params.get("search") || "");
    setSortBy((params.get("sortBy") as "id" | "title" | "reactions" | "none") || "none");
    setSortOrder((params.get("sortOrder") as "asc" | "desc") || "asc");
    setSelectedTag(params.get("tag") || "");
  }, [location.search]);

  return (
    <ErrorBoundary>
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
              onSortByChange={(value) => handleSortChange(value, sortOrder)}
              onSortOrderChange={(value) => handleSortChange(sortBy, value as "asc" | "desc")}
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
                onDeleteClick={handleDeletePost}  // 수정: deletePost -> handleDeletePost
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
              onLimitChange={handleLimitChange}  // 수정: setLimit -> handleLimitChange
              onPrevPage={handlePrevPage}        // 수정: 익명 함수 -> handlePrevPage
              onNextPage={handleNextPage}        // 수정: 익명 함수 -> handleNextPage
            />
          </div>
        </CardContent>
  
        <AddPostModal 
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          onSubmit={handleAddPost}
        />
  
        <EditPostModal
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          post={selectedPost}
          onSubmit={handleEditPost}
        />
  
        <PostDetailModal
          open={showPostDetailDialog}
          onOpenChange={setShowPostDetailDialog}
          post={selectedPost}
          searchQuery={searchQuery}
        />
  
        <UserDetailModal
          open={showUserModal}
          onOpenChange={setShowUserModal}
          user={selectedUser}
        />
  
        {error && (
          <ErrorToast
            message={error.message}
            onClose={() => setError(null)}
          />
        )}
      </Card>
    </ErrorBoundary>
  );
};

export default PostsManagerPage;