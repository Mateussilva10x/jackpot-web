import { api } from "./api";
import type {
  BetRequest,
  BonusBetRequest,
  BonusBetResponse,
} from "../types/api";

export const betsService = {
  placeBets: async (bets: BetRequest[]): Promise<void> => {
    await api.post("/bets", bets);
  },

  getBonusBet: async (): Promise<BonusBetResponse> => {
    const response = await api.get("/bonus-bets");
    return response.data;
  },

  placeBonusBet: async (bet: BonusBetRequest): Promise<void> => {
    await api.post("/bonus-bets", bet);
  },
};
