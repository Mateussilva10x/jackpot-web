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
import { standingsService } from "../services/standingsService";
import type { GroupStandingDto } from "../types/api";
import { Lock } from "lucide-react";
import { useToast } from "../hooks/useToast";

export default function Dashboard() {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<"group" | "knockout">("group");
  const [groups, setGroups] = useState<MatchGroupResponse[]>([]);
  const [standings, setStandings] = useState<
    Record<string, GroupStandingDto[]>
  >({});
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
      const [matchesData, standingsData] = await Promise.all([
        matchesService.getMatches(),
        standingsService.getGroupStandings().catch(() => ({})),
      ]);
      setGroups(matchesData);
      setStandings(standingsData);
    } catch (error) {
      console.error("Failed to load matches or standings", error);
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
    const betsPayload: BetRequest[] = updatedGames
      .filter((game) => {
        if (
          game.userBet?.homeScore === undefined ||
          game.userBet?.awayScore === undefined
        )
          return false;
        return true;
      })
      .map((game) => ({
        matchId: game.id,
        homeScore: game.userBet!.homeScore,
        awayScore: game.userBet!.awayScore,
        selectedWinnerId: game.userBet?.selectedWinnerId,
      }));

    if (betsPayload.length > 0) {
      try {
        await betsService.placeBets(betsPayload);
        showToast(t("dashboard.predictionsSavedSuccess", "Apostas salvas com sucesso!"), "success");
      } catch (error) {
        console.error("Failed to save predictions", error);
        showToast(t("dashboard.predictionsSavedError", "Erro ao salvar apostas."), "error");
      }
    }
  };

  const getProgress = (group: MatchGroupResponse) => {
    const predicted = group.matches.filter((g) => g.userBet != null).length;
    return `${predicted}/${group.matches.length}`;
  };

  const KNOCKOUT_ORDER = [
    "ROUND_32",
    "ROUND_16",
    "QUARTER",
    "SEMI",
    "THIRD_PLACE",
    "FINAL",
  ];

  const groupStageGroups = groups.filter((g) => /^[A-L]$/.test(g.group));
  const knockoutGroups = groups
    .filter((g) => !/^[A-L]$/.test(g.group))
    .sort((a, b) => {
      return KNOCKOUT_ORDER.indexOf(a.group) - KNOCKOUT_ORDER.indexOf(b.group);
    });
  const displayedGroups =
    activeTab === "group" ? groupStageGroups : knockoutGroups;

  // Check if all group stage matches are finished
  const allGroupMatchesFinished = groupStageGroups.every((g) =>
    g.matches.every((m) => m.status === "FINISHED"),
  );

  const handleKnockoutClick = (group: MatchGroupResponse) => {
    if (!allGroupMatchesFinished) {
      alert(t("dashboard.knockoutLockedUntilGroupFinished"));
      return;
    }
    handleGroupClick(group);
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isLoading ? (
          <div className="col-span-full py-20 text-center text-muted-foreground flex flex-col items-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p>{t("dashboard.loadingMatches")}</p>
          </div>
        ) : displayedGroups.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-center space-y-4 bg-card border border-border rounded-xl border-dashed">
            <div className="p-4 bg-secondary/50 rounded-full">
              <Trophy className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">
                {activeTab === "knockout"
                  ? t("dashboard.knockoutStage")
                  : t("dashboard.groupStage")}
              </h3>
              <p className="text-muted-foreground">
                {activeTab === "knockout"
                  ? t("dashboard.knockoutNotOpen")
                  : t("dashboard.noGroupsFound")}
              </p>
            </div>
          </div>
        ) : (
          displayedGroups.map((group) => {
            const isKnockout = !/^[A-L]$/.test(group.group);
            const isLockedKnockout = isKnockout && !allGroupMatchesFinished;

            return (
              <div
                key={group.group}
                onClick={() =>
                  isKnockout
                    ? handleKnockoutClick(group)
                    : handleGroupClick(group)
                }
                className={`group cursor-pointer bg-card border border-border rounded-xl p-4 transition-all ${
                  isLockedKnockout
                    ? "opacity-60 grayscale-30 hover:border-border"
                    : "hover:border-primary/50 hover:shadow-md hover:shadow-primary/5 active:scale-[0.99]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`h-10 rounded-lg bg-green-500/10 flex items-center justify-center border border-green-500/20 transition-colors ${
                        isLockedKnockout ? "" : "group-hover:bg-green-500/20"
                      } ${!isKnockout ? "w-10" : "px-3 min-w-10"}`}
                    >
                      <span
                        className={`font-bold text-green-500 whitespace-nowrap ${/^[A-L]$/.test(group.group) ? "text-xl" : "text-sm"}`}
                      >
                        {/^[A-L]$/.test(group.group)
                          ? group.group
                          : (t(`dashboard.${group.group}`) as string) ||
                            group.group}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
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
                            className="w-8 h-6 overflow-hidden flex items-center justify-center bg-secondary/50 border-2 border-card shadow-sm relative transition-transform hover:z-10 hover:scale-110"                            style={{ zIndex: 4 - index }}
                          >
                            <img
                              src={flag}
                              alt="Team flag"
                              className="w-full h-full object-fill"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48MD48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0IiBkeT0iLjM1ZW0iIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM1NTUiPj88L3RleHQ+PC9zdmc+";
                              }}
                            />
                          </div>
                        ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {isLockedKnockout ? (
                      <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground bg-secondary/50 px-2 py-1 rounded">
                        <Lock className="w-4 h-4" />
                        {t("dashboard.locked")}
                      </div>
                    ) : (
                      <>
                        <span className="text-sm font-mono text-muted-foreground bg-secondary/50 px-2 py-1 rounded">
                          {getProgress(group)}
                        </span>
                        <ChevronDown className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <GroupModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaveComplete={loadMatches}
        group={selectedGroup}
        groupStandings={
          selectedGroup ? standings[selectedGroup.group] : undefined
        }
        onSave={handleSavePredictions}
      />
    </div>
  );
}
