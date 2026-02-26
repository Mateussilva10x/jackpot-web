import api from "./api";
import type { GroupStandingDto } from "../types/api";

export const standingsService = {
  getGroupStandings: async (): Promise<Record<string, GroupStandingDto[]>> => {
    const response =
      await api.get<Record<string, GroupStandingDto[]>>("/standings");
    return response.data;
  },
};
