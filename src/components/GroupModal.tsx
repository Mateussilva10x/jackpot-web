import React, { useState } from "react";
import { Modal } from "./ui/Modal";
import { JackpotScoreInput } from "./ui/JackpotScoreInput";
import { JackpotButton } from "./ui/JackpotButton";
import { useTranslation } from "react-i18next";

import type {
  MatchGroupResponse,
  MatchBetResponse,
  GroupStandingDto,
} from "../types/api";

interface GroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  group: MatchGroupResponse | null;
  groupStandings?: GroupStandingDto[];
  onSave: (groupId: string, games: MatchBetResponse[]) => void;
}

export const GroupModal: React.FC<GroupModalProps> = ({
  isOpen,
  onClose,
  group,
  groupStandings,
  onSave,
}) => {
  const { t } = useTranslation();
  const [games, setGames] = useState<MatchBetResponse[]>([]);
  const [now, setNow] = useState(() => Date.now());

  React.useEffect(() => {
    setNow(Date.now());
    if (group) {
      setGames(JSON.parse(JSON.stringify(group.matches)));
    }
  }, [group]);

  const handleScoreChange = (
    gameId: number,
    team: "home" | "away",
    value: string,
  ) => {
    const numValue = value === "" ? undefined : parseInt(value, 10);
    setGames((prev) =>
      prev.map((game) => {
        if (game.id === gameId) {
          const currentBet =
            game.userBet ||
            ({ matchId: gameId } as import("../types/api").BetResponse);

          const updatedHomeScore =
            team === "home" ? numValue : currentBet.homeScore;
          const updatedAwayScore =
            team === "away" ? numValue : currentBet.awayScore;

          let selectedWinnerId = currentBet.selectedWinnerId;

          if (
            isKnockout &&
            updatedHomeScore !== undefined &&
            updatedAwayScore !== undefined
          ) {
            if (updatedHomeScore > updatedAwayScore) {
              selectedWinnerId = 1;
            } else if (updatedAwayScore > updatedHomeScore) {
              selectedWinnerId = 2;
            } else {
              if (currentBet.homeScore !== currentBet.awayScore) {
                selectedWinnerId = undefined;
              }
            }
          }

          return {
            ...game,
            userBet: {
              ...currentBet,
              [team === "home" ? "homeScore" : "awayScore"]: numValue,
              selectedWinnerId,
            },
          };
        }
        return game;
      }),
    );
  };

  const handleFlagClick = (gameId: number, teamId: 1 | 2) => {
    if (!isKnockout) return;

    setGames((prev) =>
      prev.map((game) => {
        if (game.id === gameId) {
          const currentBet = game.userBet;
          if (
            currentBet &&
            currentBet.homeScore !== undefined &&
            currentBet.awayScore !== undefined &&
            currentBet.homeScore === currentBet.awayScore
          ) {
            return {
              ...game,
              userBet: {
                ...currentBet,
                selectedWinnerId: teamId,
              },
            };
          }
        }
        return game;
      }),
    );
  };

  const handleSave = () => {
    if (group) {
      onSave(group.group, games);
      onClose();
    }
  };

  if (!group) return null;

  const uniqueTeams = Array.from(
    new Set(group.matches.flatMap((m) => [m.homeTeam, m.awayTeam])),
  );

  const isKnockout = !/^[A-L]$/.test(group.group);
  const titleText = isKnockout
    ? `${t(`dashboard.${group.group}`)} - ${t("groupModal.predictions")}`
    : `${t("dashboard.groupStage").split(" ")[0] || "Group"} ${group.group} - ${t("groupModal.predictions")}`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={titleText}>
      <div className="space-y-8">
        {!isKnockout && (
          <div className="bg-secondary/20 rounded-xl p-4 border border-border">
            <h3 className="text-sm font-bold text-muted-foreground uppercase mb-4 tracking-wider">
              {t("groupModal.standings")}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50 text-muted-foreground">
                    <th className="px-4 py-2 text-left font-medium">
                      {t("groupModal.team")}
                    </th>
                    <th className="px-4 py-2 text-center font-medium">
                      {t("groupModal.played")}
                    </th>
                    <th className="px-4 py-2 text-center font-medium">
                      {t("groupModal.won")}
                    </th>
                    <th className="px-4 py-2 text-center font-medium">
                      {t("groupModal.drawn")}
                    </th>
                    <th className="px-4 py-2 text-center font-medium">
                      {t("groupModal.lost")}
                    </th>
                    <th className="px-4 py-2 text-center font-medium">
                      {t("groupModal.goalDifference")}
                    </th>
                    <th className="px-4 py-2 text-center font-medium">
                      {t("groupModal.points")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {groupStandings && groupStandings.length > 0
                    ? groupStandings.map((standing, i) => (
                        <tr
                          key={standing.teamName}
                          className="border-b border-border/50 last:border-0 hover:bg-secondary/30 transition-colors"
                        >
                          <td className="px-4 py-3 font-medium flex items-center gap-2">
                            <span className="text-xs text-muted-foreground w-4">
                              {i + 1}
                            </span>
                            <div className="w-4 h-4 rounded-sm overflow-hidden flex items-center justify-center bg-secondary/50 border border-border shadow-sm">
                              <img
                                src={standing.flagUrl}
                                alt={`${standing.teamName} flag`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48MD48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0IiBkeT0iLjM1ZW0iIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM1NTUiPj88L3RleHQ+PC9zdmc+";
                                }}
                              />
                            </div>
                            {standing.teamName}
                          </td>
                          <td className="px-4 py-3 text-center text-muted-foreground">
                            {standing.matchesPlayed}
                          </td>
                          <td className="px-4 py-3 text-center text-muted-foreground">
                            {standing.wins}
                          </td>
                          <td className="px-4 py-3 text-center text-muted-foreground">
                            {standing.draws}
                          </td>
                          <td className="px-4 py-3 text-center text-muted-foreground">
                            {standing.losses}
                          </td>
                          <td className="px-4 py-3 text-center text-muted-foreground">
                            {standing.goalDifference}
                          </td>
                          <td className="px-4 py-3 text-center font-bold text-primary">
                            {standing.points}
                          </td>
                        </tr>
                      ))
                    : uniqueTeams.map((team, i) => (
                        <tr
                          key={team}
                          className="border-b border-border/50 last:border-0 hover:bg-secondary/30 transition-colors"
                        >
                          <td className="px-4 py-3 font-medium flex items-center gap-2">
                            <span className="text-xs text-muted-foreground w-4">
                              {i + 1}
                            </span>
                            <div className="w-4 h-4 rounded-sm overflow-hidden flex items-center justify-center bg-secondary/50 border border-border shadow-sm">
                              <img
                                src={
                                  group.matches.find((m) => m.homeTeam === team)
                                    ?.homeTeamFlag ||
                                  group.matches.find((m) => m.awayTeam === team)
                                    ?.awayTeamFlag ||
                                  ""
                                }
                                alt="Team flag"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48MD48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0IiBkeT0iLjM1ZW0iIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM1NTUiPj88L3RleHQ+PC9zdmc+";
                                }}
                              />
                            </div>
                            {team}
                          </td>
                          <td className="px-4 py-3 text-center text-muted-foreground">
                            0
                          </td>
                          <td className="px-4 py-3 text-center text-muted-foreground">
                            0
                          </td>
                          <td className="px-4 py-3 text-center text-muted-foreground">
                            0
                          </td>
                          <td className="px-4 py-3 text-center text-muted-foreground">
                            0
                          </td>
                          <td className="px-4 py-3 text-center text-muted-foreground">
                            0
                          </td>
                          <td className="px-4 py-3 text-center font-bold text-primary">
                            0
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div>
          <h3 className="text-sm font-bold text-muted-foreground uppercase mb-4 tracking-wider">
            {t("groupModal.matches")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {games.map((game) => {
              const isMatchLocked =
                game.status !== "SCHEDULED" ||
                new Date(game.dateTime).getTime() <= now;

              return (
                <div
                  key={game.id}
                  className={`bg-card border rounded-xl overflow-hidden flex flex-col transition-colors ${
                    isMatchLocked
                      ? "border-border/40 opacity-75"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="bg-secondary/30 px-3 py-2 flex items-center justify-between border-b border-border/50">
                    <div className="flex items-center gap-2">
                      {isMatchLocked ? (
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      )}
                      <span className="text-[10px] font-bold text-foreground uppercase tracking-wider">
                        {isMatchLocked
                          ? t("groupModal.locked", "Fechado")
                          : "Copa 2026"}
                      </span>
                    </div>
                    <div className="text-[10px] font-mono text-muted-foreground">
                      {new Date(game.dateTime).toLocaleDateString()} •{" "}
                      {new Date(game.dateTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>

                  <div className="p-4 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col items-center gap-1 flex-1">
                        <div
                          className={`w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-xl shadow-sm overflow-hidden transition-all ${
                            isKnockout &&
                            game.userBet?.homeScore !== undefined &&
                            game.userBet?.awayScore !== undefined &&
                            game.userBet.homeScore === game.userBet.awayScore &&
                            !isMatchLocked
                              ? "cursor-pointer hover:ring-2 hover:ring-primary/50"
                              : ""
                          } ${
                            isKnockout && game.userBet?.selectedWinnerId === 1
                              ? "ring-2 ring-primary ring-offset-2 ring-offset-card"
                              : "ring-1 ring-border"
                          } ${isMatchLocked ? "opacity-75 grayscale-[50%]" : ""}`}
                          onClick={() => {
                            if (!isMatchLocked) handleFlagClick(game.id, 1);
                          }}
                        >
                          <img
                            src={game.homeTeamFlag}
                            alt={`${game.homeTeam} flag`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48MD48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0IiBkeT0iLjM1ZW0iIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM1NTUiPj88L3RleHQ+PC9zdmc+";
                            }}
                          />
                        </div>
                        <span
                          className={`font-bold text-xs text-center truncate w-full px-1 ${
                            isKnockout && game.userBet?.selectedWinnerId === 1
                              ? "text-primary"
                              : ""
                          }`}
                          title={game.homeTeam}
                        >
                          {game.homeTeam}
                        </span>
                      </div>

                      <span className="text-muted-foreground font-bold text-xs px-2">
                        VS
                      </span>

                      <div className="flex flex-col items-center gap-1 flex-1">
                        <div
                          className={`w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-xl shadow-sm overflow-hidden transition-all ${
                            isKnockout &&
                            game.userBet?.homeScore !== undefined &&
                            game.userBet?.awayScore !== undefined &&
                            game.userBet.homeScore === game.userBet.awayScore &&
                            !isMatchLocked
                              ? "cursor-pointer hover:ring-2 hover:ring-primary/50"
                              : ""
                          } ${
                            isKnockout && game.userBet?.selectedWinnerId === 2
                              ? "ring-2 ring-primary ring-offset-2 ring-offset-card"
                              : "ring-1 ring-border"
                          } ${isMatchLocked ? "opacity-75 grayscale-[50%]" : ""}`}
                          onClick={() => {
                            if (!isMatchLocked) handleFlagClick(game.id, 2);
                          }}
                        >
                          <img
                            src={game.awayTeamFlag}
                            alt={`${game.awayTeam} flag`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48MD48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0IiBkeT0iLjM1ZW0iIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM1NTUiPj88L3RleHQ+PC9zdmc+";
                            }}
                          />
                        </div>
                        <span
                          className={`font-bold text-xs text-center truncate w-full px-1 ${
                            isKnockout && game.userBet?.selectedWinnerId === 2
                              ? "text-primary"
                              : ""
                          }`}
                          title={game.awayTeam}
                        >
                          {game.awayTeam}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-2 bg-secondary/20 p-2 rounded-lg border border-border/30">
                      <JackpotScoreInput
                        value={game.userBet?.homeScore?.toString() ?? ""}
                        onChange={(val) => {
                          if (!isMatchLocked)
                            handleScoreChange(game.id, "home", val);
                        }}
                        disabled={isMatchLocked}
                        className={`w-10 h-10 text-lg shadow-inner bg-background ${isMatchLocked ? "opacity-60 cursor-not-allowed" : ""}`}
                      />
                      <span className="text-muted-foreground font-medium text-xs">
                        x
                      </span>
                      <JackpotScoreInput
                        value={game.userBet?.awayScore?.toString() ?? ""}
                        onChange={(val) => {
                          if (!isMatchLocked)
                            handleScoreChange(game.id, "away", val);
                        }}
                        disabled={isMatchLocked}
                        className={`w-10 h-10 text-lg shadow-inner bg-background ${isMatchLocked ? "opacity-60 cursor-not-allowed" : ""}`}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
          <JackpotButton variant="ghost" onClick={onClose} type="button">
            {t("groupModal.cancel")}
          </JackpotButton>
          <JackpotButton variant="primary" onClick={handleSave} type="button">
            {t("groupModal.savePredictions")}
          </JackpotButton>
        </div>
      </div>
    </Modal>
  );
};
