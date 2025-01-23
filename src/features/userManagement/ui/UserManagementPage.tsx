import React, { useState, useEffect } from "react";
import { useUserContext } from "../model/userContext";
import { useUserActions } from "../model/userActions";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell,
  Button,
  Dialog,
  DialogContent
} from "../../../shared/ui";
import { User } from "../../../entities/types";

const UserManagementPage: React.FC = () => {
  const { state } = useUserContext();
  const userActions = useUserActions();

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  useEffect(() => {
    userActions.fetchUsers();
  }, []);

  const handleUserDetail = (user: User) => {
    setSelectedUser(user);
    setIsUserModalOpen(true);
  };

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle>사용자 관리</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>이름</TableHead>
              <TableHead>이메일</TableHead>
              <TableHead>작업</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {state.users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleUserDetail(user)}
                  >
                    상세 보기
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {selectedUser && (
          <Dialog 
            open={isUserModalOpen} 
            onOpenChange={setIsUserModalOpen}
          >
            <DialogContent>
              <div className="space-y-4">
                <img 
                  src={selectedUser.image} 
                  alt={selectedUser.username} 
                  className="w-24 h-24 rounded-full mx-auto" 
                />
                <h2 className="text-xl font-bold text-center">
                  {selectedUser.username}
                </h2>
                <div className="space-y-2">
                  <p>
                    <strong>이름:</strong> {selectedUser.firstName} {selectedUser.lastName}
                  </p>
                  <p>
                    <strong>이메일:</strong> {selectedUser.email}
                  </p>
                  <p>
                    <strong>전화번호:</strong> {selectedUser.phone}
                  </p>
                  {selectedUser.address && (
                    <p>
                      <strong>주소:</strong> {selectedUser.address.address}, 
                      {selectedUser.address.city}, {selectedUser.address.state}
                    </p>
                  )}
                  {selectedUser.company && (
                    <p>
                      <strong>회사:</strong> {selectedUser.company.name} - 
                      {selectedUser.company.title}
                    </p>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
};

export default UserManagementPage;