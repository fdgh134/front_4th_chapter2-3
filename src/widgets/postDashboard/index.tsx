import { DashboardHeader } from "./ui/dashboardHeader";
import { DashboardContent } from "./ui/dashboardContent";
import { Card, CardContent } from "../../shared/ui";
import { useLocation, useNavigate } from "react-router-dom";
import { PostFilters } from "../../pages/postsManager/ui/PostFilters";
import { useState, useEffect } from "react";
import { useSearch } from "./hooks/useSearch";
import { Post, User, PostApiResponse, SortBy, SortOrder } from "../../entities/types";
import { PostPagination } from "../../features/postManagement/ui/postPagination";
import { usePostStore } from "../../entities/post/model/store";

export const PostDashboard = () => {
  const navigate = useNavigate()
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const { 
    posts,
    total,
    pagination: { skip, limit },
    loading,
    filters: { sortBy, sortOrder },
    setPagination,
    setPosts,
    setTotal,
    setLoading,
    setFilters
  } = usePostStore();
  
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState(queryParams.get("tag") || "");
  const { searchTerm, setSearchTerm, filteredPosts } = useSearch(posts, "title");

  // URL 업데이트 함수
  const updateURL = () => {
    const params = new URLSearchParams()
    if (skip) params.set("skip", skip.toString());
    if (limit) params.set("limit", limit.toString());
    if (searchTerm) params.set("search", searchTerm);
    if (sortBy) params.set("sortBy", sortBy);
    if (sortOrder) params.set("sortOrder", sortOrder);
    if (selectedTag) params.set("tag", selectedTag);
    navigate(`?${params.toString()}`);
  }

  // 게시물 가져오기
  const fetchPosts = () => {
    setLoading(true)
    fetch(`/api/posts?limit=${limit}&skip=${skip}`)
      .then((response) => response.json())
      .then((postsData: PostApiResponse) => 
        fetch("/api/users?limit=0&select=username,image")
          .then((response) => response.json())
          .then((usersResponse) => {
            const usersData: User[] = usersResponse.users;
            const postsWithUsers = postsData.posts.map((post: Post) => ({
              ...post,
              author: usersData.find((user: User) => user.id === post.userId),
            }));
            setPosts(postsWithUsers);
            setTotal(postsData.total);
          })
      )
      .catch((error) => {
        console.error("게시물 가져오기 오류:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // 태그 가져오기
  const fetchTags = async () => {
    try {
      const response = await fetch("/api/posts/tags")
      const data = await response.json()
      setTags(data)
    } catch (error) {
      console.error("태그 가져오기 오류:", error)
    }
  }

  // 태그별 게시물 가져오기
  const fetchPostsByTag = async (tag: string) => {
    if (!tag || tag === "all") {
      fetchPosts();
      return;
    }
  
    setLoading(true);
    try {
      const [postsResponse, usersResponse] = await Promise.all([
        fetch(`/api/posts/tag/${tag}`),
        fetch("/api/users?limit=0&select=username,image"),
      ]);
  
      const postsData = await postsResponse.json();
      const usersData = await usersResponse.json();
  
      const postsWithUsers = postsData.posts.map((post: Post) => ({
        ...post,
        author: usersData.users.find((user: User) => user.id === post.userId),
      }));
  
      setPosts(postsWithUsers);
      setTotal(postsData.total);
    } catch (error) {
      console.error("태그별 게시물 가져오기 오류:", error);
    } finally {
      setLoading(false);
    }
  };

  // 정렬 핸들러
  const handleSortByChange = (value: SortBy) => {
    setFilters({ sortBy: value });
  };

  const handleSortOrderChange = (value: SortOrder) => {
    setFilters({ sortOrder: value });
  };

  // 초기 데이터 로드
  useEffect(() => {
    fetchTags();
  }, []);

  // URL 파라미터 및 상태 동기화
  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const newSkip = parseInt(params.get("skip") || "0");
    const newLimit = parseInt(params.get("limit") || "10");
    const newSearchTerm = params.get("search") || "";
    const newSelectedTag = params.get("tag") || "";

    const sortByParam = params.get("sortBy");
    const sortOrderParam = params.get("sortOrder");

    const validSortBy = (val: string | null): val is SortBy => 
      val !== null && ['none', 'id', 'title', 'reactions'].includes(val);

    const validSortOrder = (val: string | null): val is SortOrder =>
      val !== null && ['asc', 'desc'].includes(val);

    // 실제 값이 변경된 경우에만 상태 업데이트
    const shouldUpdate = 
      newSkip !== skip ||
      newLimit !== limit ||
      newSearchTerm !== searchTerm ||
      newSelectedTag !== selectedTag ||
      (validSortBy(sortByParam) && sortByParam !== sortBy) ||
      (validSortOrder(sortOrderParam) && sortOrderParam !== sortOrder);

    if (shouldUpdate) {
      // 배치로 상태 업데이트
      setPagination({ skip: newSkip, limit: newLimit });
      setSearchTerm(newSearchTerm);
      setSelectedTag(newSelectedTag);
      
      setFilters({
        sortBy: validSortBy(sortByParam) ? sortByParam : 'none',
        sortOrder: validSortOrder(sortOrderParam) ? sortOrderParam : 'asc'
      });
    }
  }, [location.search, skip, limit, searchTerm, selectedTag, sortBy, sortOrder]);

  // 데이터 fetching 및 URL 업데이트
  useEffect(() => {
    if (selectedTag) {
      fetchPostsByTag(selectedTag);
    } else {
      fetchPosts();
    }
    updateURL();
  }, [skip, limit, sortBy, sortOrder, searchTerm, selectedTag]);

  // 페이지네이션 핸들러
  const handleLimitChange = (newLimit: number) => {
    setPagination({ limit: newLimit });
  };
  
  const handlePrevPage = () => {
    setPagination({ 
      skip: Math.max(0, skip - limit)
    });
  };
  
  const handleNextPage = () => {
    setPagination({ 
      skip: skip + limit 
    });
  };

  return (
    <Card className="w-full max-w-7xl mx-auto border border-gray-300 rounded">
      <CardContent className="p-6">
        <DashboardHeader />
        <PostFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedTag={selectedTag}
          setSelectedTag={(tag) => {
            setSelectedTag(tag);
            updateURL();
          }}
          sortBy={sortBy as SortBy}
          setSortBy={handleSortByChange}
          sortOrder={sortOrder as SortOrder}
          setSortOrder={handleSortOrderChange}
          tags={tags}
          updateURL={updateURL}
        />
        <DashboardContent 
          posts={filteredPosts} 
          loading={loading} 
          total={total} 
        />
        <PostPagination 
          total={total}
          skip={skip}
          limit={limit}
          onLimitChange={handleLimitChange}
          onPrevPage={handlePrevPage}
          onNextPage={handleNextPage}
        />
          </CardContent>
    </Card>
  );
  
};