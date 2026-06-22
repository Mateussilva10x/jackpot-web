import { api } from "./api";
import type {
  UserRankingDto,
  PageResponse,
  RankingEvolutionPoint,
} from "../types/api";

export const rankingService = {
  getRanking: async (
    page = 0,
    size = 50,
  ): Promise<PageResponse<UserRankingDto>> => {
    const response = await api.get(`/ranking?page=${page}&size=${size}`);
    return response.data;
  },

  getUserEvolution: async (
    userId: string | number,
  ): Promise<RankingEvolutionPoint[]> => {
    const response = await api.get(`/ranking/${userId}/evolution`);
    return response.data;
  },
};
