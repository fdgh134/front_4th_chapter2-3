import { TagBadge } from "./TagBadge";

interface TagListProps {
  tags: string[];
  selectedTag?: string;
  onTagClick: (tag: string) => void;
}

export const TagList = ({ tags, selectedTag, onTagClick }: TagListProps) => {
  return (
    <div className="flex flex-wrap gap-1">
    {tags.map(tag => (
      <TagBadge
        key={tag}
        tag={tag}
        isSelected={tag === selectedTag}
        onClick={() => onTagClick(tag)}
      />
    ))}
  </div>
  );
};