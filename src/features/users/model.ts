import { useUserStore } from "../../entities/users";
import { useCallback } from "react";
import { userApi } from "../../entities/users";

export const useUserFeatures = () => {
  const { setLoading, setUsers, setSelectedUser } = useUserStore();

  const fetchUsers = useCallback(async (params: { limit: number; select?: string }) => {
    setLoading(true);
    try {
      const data = await userApi.getAll(params);
      setUsers(data.users);
    } catch (error) {
      console.error("사용자 목록 가져오기 오류:", error);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setUsers]);

  const fetchUserDetails = useCallback(async (id: number) => {
    setLoading(true);
    try {
      const user = await userApi.getById(id);
      setSelectedUser(user);
      return user;
    } catch (error) {
      console.error("사용자 상세정보 가져오기 오류:", error);
      setSelectedUser(null);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setSelectedUser]);

  return { fetchUsers, fetchUserDetails };
};