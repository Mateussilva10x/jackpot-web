import { useState } from "react";
import { Countdown, BonusPredictions } from "../components/DashboardHeader";
import { useEffect } from "react";
import { GroupModal } from "../components/GroupModal";
import type {
  MatchGroupResponse,
  MatchBetResponse,
  BetRequest,
} from "../types/api";
import { matchesService } from "../services/matchesService";
import { betsService } from "../services/betsService";
import { ChevronDown, Trophy } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Dashboard() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<"group" | "knockout">("group");
  const [groups, setGroups] = useState<MatchGroupResponse[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<MatchGroupResponse | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      setIsLoading(true);
      const data = await matchesService.getMatches();
      setGroups(data);
    } catch (error) {
      console.error("Failed to load matches", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGroupClick = (group: MatchGroupResponse) => {
    setSelectedGroup(group);
    setIsModalOpen(true);
  };

  const handleSavePredictions = async (
    _groupId: string,
    updatedGames: MatchBetResponse[],
  ) => {
    // Only send bets that have been modified (i.e., user entered scores)
    const betsPayload: BetRequest[] = updatedGames
      .filter(
        (game) =>
          game.userBet?.homeScore !== undefined &&
          game.userBet?.awayScore !== undefined,
      )
      .map((game) => ({
        matchId: game.id,
        homeScore: game.userBet!.homeScore,
        awayScore: game.userBet!.awayScore,
      }));

    if (betsPayload.length > 0) {
      try {
        await betsService.placeBets(betsPayload);
        await loadMatches(); // Reload from backend to sync state
      } catch (error) {
        console.error("Failed to save bets", error);
      }
    }
  };

  // Calculate progress
  const getProgress = (group: MatchGroupResponse) => {
    const predicted = group.matches.filter((g) => g.userBet != null).length;
    return `${predicted}/${group.matches.length}`;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Countdown />

      <BonusPredictions />

      {/* Stage Toggles */}
      <div className="flex bg-secondary/30 p-1 rounded-xl mb-8 border border-border">
        <button
          onClick={() => setActiveTab("group")}
          className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${
            activeTab === "group"
              ? "bg-secondary text-primary shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {t("dashboard.groupStage")}
        </button>
        <button
          onClick={() => setActiveTab("knockout")}
          className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${
            activeTab === "knockout"
              ? "bg-secondary text-primary shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {t("dashboard.knockoutStage")}
        </button>
      </div>

      {activeTab === "group" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {isLoading ? (
            <div className="col-span-full py-20 text-center text-muted-foreground flex flex-col items-center">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
              <p>{t("dashboard.loadingMatches")}</p>
            </div>
          ) : (
            groups.map((group) => (
              <div
                key={group.group}
                onClick={() => handleGroupClick(group)}
                className="group cursor-pointer bg-card border border-border rounded-xl p-4 hover:border-primary/50 transition-all hover:shadow-md hover:shadow-primary/5 active:scale-[0.99]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center border border-green-500/20 group-hover:bg-green-500/20 transition-colors">
                      <span className="text-xl font-bold text-green-500">
                        {group.group}
                      </span>
                    </div>

                    <div className="flex items-center -space-x-2">
                      {Array.from(
                        new Set(
                          group.matches.flatMap((m) => [
                            m.homeTeamFlag,
                            m.awayTeamFlag,
                          ]),
                        ),
                      )
                        .slice(0, 4)
                        .map((flag, index) => (
                          <div
                            key={flag}
                            className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center bg-secondary/50 border-2 border-card shadow-sm relative transition-transform hover:z-10 hover:scale-110"
                            style={{ zIndex: 4 - index }}
                          >
                            <img
                              src={flag}
                              alt="Team flag"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                // Fallback to a placeholder if image fails to load
                                (e.target as HTMLImageElement).src =
                                  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48MD48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0IiBkeT0iLjM1ZW0iIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM1NTUiPj88L3RleHQ+PC9zdmc+";
                              }}
                            />
                          </div>
                        ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm font-mono text-muted-foreground bg-secondary/50 px-2 py-1 rounded">
                      {getProgress(group)}
                    </span>

                    <ChevronDown className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 bg-card border border-border rounded-xl border-dashed">
          <div className="p-4 bg-secondary/50 rounded-full">
            <Trophy className="w-8 h-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">
              {t("dashboard.knockoutStage")}
            </h3>
            <p className="text-muted-foreground">
              {t("dashboard.knockoutNotOpen")}
            </p>
          </div>
        </div>
      )}

      <GroupModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        group={selectedGroup}
        onSave={handleSavePredictions}
      />
    </div>
  );
}
