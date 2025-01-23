import React from "react";
import { PostProvider } from "../../features/postManagement/model/postContext";
import { UserProvider } from "../../features/userManagement/model/userContext";
import { CommentProvider } from "../../features/commentManagement/model/commentContext";
import { StoreProvider } from "./provider";

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <StoreProvider>
      <UserProvider>
        <CommentProvider>
          <PostProvider>
            {children}
          </PostProvider>
        </CommentProvider>
      </UserProvider>
    </StoreProvider>
  );
};