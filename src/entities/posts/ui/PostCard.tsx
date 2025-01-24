import { Card, CardHeader, CardTitle, CardContent } from "../../../shared/ui";
import type { Post } from "../model/types";

interface PostCardProps {
  post: Post;
};

export const PostCard = ({ post }: PostCardProps) => {
  return(
    <Card>
      <CardHeader>
        <CardTitle>{post.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{post.body}</p>
      </CardContent>
    </Card>
  );
};
