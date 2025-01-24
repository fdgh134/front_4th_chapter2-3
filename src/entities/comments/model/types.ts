import { User } from "../../users/model/types";

export interface Comment {
  id: number;
  postId: number;
  body: string;
  userId: number;
  user: User;
  likes: number;
}