import { User } from "../../types";
import { Card, CardContent, CardHeader, CardTitle } from "../../../shared/ui";

interface UserCardProps {
  user: User;
}

export const UserCard = ({ user }: UserCardProps) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-4">
        <img src={user.image} alt={user.username} className="w-16 h-16 rounded-full" />
        <span>{user.username}</span>
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-2">
      <p>
        <strong>이름:</strong> {user.firstName} {user.lastName}
      </p>
      <p>
        <strong>이메일:</strong> {user.email}
      </p>
      <p>
        <strong>전화번호:</strong> {user.phone}
      </p>
      <p>
        <strong>주소:</strong> {user.address?.address}, {user.address?.city}, {user.address?.state}
      </p>
      {user.company && (
        <p>
          <strong>직장:</strong> {user.company.name} - {user.company.title}
        </p>
      )}
    </CardContent>
  </Card>
);