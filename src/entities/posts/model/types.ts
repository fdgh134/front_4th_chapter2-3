import { User } from "../../users";
export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
  tags: string[];
  reactions: number | {
    likes: number;
    dislikes: number;
  };
  author?: User;
}
// dummyjson API 응답 타입
export interface PostsResponse {
  posts: Post[];
  total: number;
  skip: number;
  limit: number;
};