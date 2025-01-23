import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

const PostsManager = lazy(() => import("../../features/postManagement/ui/PostManagerPage"));
const UserManagement = lazy(() => import("../../features/userManagement/ui/UserManagementPage"));

export const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <Routes>
        <Route path="/" element={<PostsManager />} />
        <Route path="/users" element={<UserManagement />} />
      </Routes>
    </Suspense>
  );
};