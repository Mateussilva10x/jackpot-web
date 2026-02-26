import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { matchesService } from "../services/matchesService";
import { adminService } from "../services/adminService";
import { ChevronDown, Trophy } from "lucide-react";

import type { MatchGroupResponse, MatchScoreUpdateDto } from "../types/api";

import { AdminMatchModal } from "../components/admin/AdminMatchModal";
import { AdminBonusResolution } from "../components/admin/AdminBonusResolution";

export default function Admin() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<"group" | "knockout">("group");
  const [groups, setGroups] = useState<MatchGroupResponse[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<MatchGroupResponse | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadMatches();
  }, []);

  if (user?.role !== "ADMIN") {
    return <Navigate to="/dashboard" replace />;
  }

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

  const handleFinalizeMatch = async (
    matchId: number,
    data: MatchScoreUpdateDto,
  ) => {
    try {
      await adminService.finalizeMatch(matchId, data);
      await loadMatches(); // Reload from backend to sync state

      // Update selectedGroup dynamically so the modal gets the latest data
      setSelectedGroup((prev) => {
        if (!prev) return prev;
        const updatedMatches = prev.matches.map((m) => {
          if (m.id === matchId) {
            return {
              ...m,
              status: "FINISHED",
            };
          }
          return m;
        });
        return { ...prev, matches: updatedMatches };
      });
    } catch (error) {
      console.error("Failed to finalize match", error);
      throw error; // Re-throw to handle loading state in modal if needed
    }
  };

  // Calculate progress of finalized matches
  const getProgress = (group: MatchGroupResponse) => {
    const finalized = group.matches.filter(
      (g) => g.status === "FINISHED",
    ).length;
    return `${finalized}/${group.matches.length}`;
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

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          {t("admin.title")}
        </h1>
        <p className="text-muted-foreground mt-2">{t("admin.subtitle")}</p>
      </div>

      <AdminBonusResolution />

      {/* Stage Toggles */}
      <h2 className="text-xl font-bold mb-4">{t("admin.officialResults")}</h2>
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
          displayedGroups.map((group) => (
            <div
              key={group.group}
              onClick={() => handleGroupClick(group)}
              className="group cursor-pointer bg-card border border-border rounded-xl p-4 hover:border-primary/50 transition-all hover:shadow-md hover:shadow-primary/5 active:scale-[0.99]"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={`h-10 rounded-lg bg-red-500/10 flex items-center justify-center border border-red-500/20 group-hover:bg-red-500/20 transition-colors ${/^[A-L]$/.test(group.group) ? "w-10" : "px-3 min-w-[2.5rem]"}`}
                  >
                    <span
                      className={`font-bold text-red-500 whitespace-nowrap ${/^[A-L]$/.test(group.group) ? "text-xl" : "text-sm"}`}
                    >
                      {/^[A-L]$/.test(group.group)
                        ? group.group
                        : (t(`dashboard.${group.group}`) as string) ||
                          group.group}
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
                              (e.target as HTMLImageElement).src =
                                "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48MD48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0IiBkeT0iLjM1ZW0iIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM1NTUiPj88L3RleHQ+PC9zdmc+";
                            }}
                          />
                        </div>
                      ))}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-muted-foreground bg-secondary/50 px-2 py-1 rounded border border-border">
                    {getProgress(group)} {t("admin.finalized")}
                  </span>

                  <ChevronDown className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <AdminMatchModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        group={selectedGroup}
        onFinalizeMatch={handleFinalizeMatch}
      />
    </div>
  );
}
