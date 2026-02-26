import { api } from "./api";
import type {
  MatchScoreUpdateDto,
  BonusBetResolutionRequest,
} from "../types/api";

export const adminService = {
  finalizeMatch: async (
    id: number,
    data: MatchScoreUpdateDto,
  ): Promise<void> => {
    await api.put(`/admin/matches/${id}`, data);
  },

  resolveBonusBets: async (data: BonusBetResolutionRequest): Promise<void> => {
    await api.post("/admin/bonus-bets/resolve", data);
  },
};
