import { Card, CardHeader, CardTitle, CardContent } from "../../../shared/ui";
import { Post } from "../model/types";
import { User } from "../../users/model/types";
import { TagBadge } from "../../tags/ui/TagBadge";

interface PostCardProps {
  post: Post;
  author?: User;
  onTagClick?: (tag: string) => void;
};

export const PostCard = ({ post, author, onTagClick }: PostCardProps) => {
  return(
    <Card>
      <CardHeader>
        <CardTitle>{post.title}</CardTitle>
        {author && (
          <div className="flex items-center gap-2">
            <img
              src={author.image}
              alt={author.username}
              className="w-6 h-6 rounded-full"
            />
            <span className="text-sm text-gray-500">
              {author.username}
            </span>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <p className="mb-4">{post.body}</p>
        {post.tags && (
          <div className="flex flex-wrap gap-1">
            {post.tags.map(tag => (
              <TagBadge
                key={tag}
                tag={tag}
                onClick={() => onTagClick?.(tag)}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
