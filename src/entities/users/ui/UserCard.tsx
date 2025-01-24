import { Card, CardContent } from "../../../shared/ui";
import { User } from "../model/types";

interface UserCardProps {
  user: User;
}

export const UserCard = ({ user }: UserCardProps) => {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-4">
        <img 
          src={user.image} 
          alt={user.username} 
          className="w-16 h-16 rounded-full"
        />
        <div>
          <h3 className="text-lg font-semibold">{user.username}</h3>
          <p className="text-sm text-gray-500">
            {user.firstName} {user.lastName}
          </p>
          {user.company && (
            <p className="text-sm text-gray-500">
              {user.company.title} at {user.company.name}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};