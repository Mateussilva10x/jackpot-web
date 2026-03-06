import { api } from "./api";
import type { UserProfileDto } from "../types/api";

export const userService = {
  getUserProfile: async (id: string | number): Promise<UserProfileDto> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  getMyProfile: async (): Promise<UserProfileDto> => {
    const response = await api.get("/ranking/me");
    return response.data;
  },

  updateAvatar: async (avatarId: number): Promise<void> => {
    await api.put("/users/me/avatar", { avatarId });
  },
};
