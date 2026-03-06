import api from "./api";
import type { TeamDto } from "../types/api";

export const teamsService = {
  getTeams: async (): Promise<TeamDto[]> => {
    const { data } = await api.get<TeamDto[]>("/teams");
    return data;
  },
};
