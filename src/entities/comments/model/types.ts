import { User } from "../../users/model/types";

export interface IComment {
  id: number;
  body: string;
  postId: number;
  userId: number;
  user: User;
  likes: number;
}

export type NewComment = Pick<IComment, "body" | "postId" | "userId">;