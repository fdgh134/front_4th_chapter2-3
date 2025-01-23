import { apiClient } from "../../../shared/api";
import { UsersResponse, User } from "../../types";



export const userApi = {
  // 사용자 조회
  getUsers: (params?: { limit?: number; select?: string }) =>
    apiClient.get<UsersResponse>(
      `/api/users?${new URLSearchParams({
        limit: (params?.limit || 0).toString(),
        select: params?.select || "",
      }).toString()}`
    ),

  getUserById: (id: number) =>
    apiClient.get<User>(`/api/users/${id}`),

  // 사용자 생성/수정/삭제 (필요한 경우)
  createUser: (user: Omit<User, "id">) =>
    apiClient.post<User>("/api/users", user),

  updateUser: (id: number, user: Partial<User>) =>
    apiClient.put<User>(`/api/users/${id}`, user),

  deleteUser: (id: number) =>
    apiClient.delete(`/api/users/${id}`),
};