import { api } from "./api";
import type { UserRankingDto, PageResponse } from "../types/api";

export const rankingService = {
  getRanking: async (
    page = 0,
    size = 50,
  ): Promise<PageResponse<UserRankingDto>> => {
    const response = await api.get(`/ranking?page=${page}&size=${size}`);
    return response.data;
  },
};
