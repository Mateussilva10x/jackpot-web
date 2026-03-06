import { api } from "./api";
import type { MatchGroupResponse } from "../types/api";

export const matchesService = {
  getMatches: async (): Promise<MatchGroupResponse[]> => {
    const response = await api.get("/matches");
    return response.data;
  },
};
