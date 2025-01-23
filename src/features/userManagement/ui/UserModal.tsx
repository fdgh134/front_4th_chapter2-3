import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../shared/ui";
import { useUserContext } from "../model/userContext";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose }) => {
  const { state } = useUserContext();
  const selectedUser = state.selectedUser;

  if (!selectedUser) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>사용자 상세 정보</DialogTitle>
        </DialogHeader>
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
            <p><strong>이름:</strong> {selectedUser.firstName} {selectedUser.lastName}</p>
            <p><strong>이메일:</strong> {selectedUser.email}</p>
            <p><strong>전화번호:</strong> {selectedUser.phone}</p>
            <p><strong>나이:</strong> {selectedUser.age}</p>
            
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
  );
};