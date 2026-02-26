import React, { useState } from "react";
import { Modal } from "../ui/Modal";
import { JackpotScoreInput } from "../ui/JackpotScoreInput";
import { JackpotButton } from "../ui/JackpotButton";
import { useTranslation } from "react-i18next";

import type { MatchGroupResponse, MatchScoreUpdateDto } from "../../types/api";

interface AdminMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  group: MatchGroupResponse | null;
  onFinalizeMatch: (
    matchId: number,
    data: MatchScoreUpdateDto,
  ) => Promise<void>;
}

export const AdminMatchModal: React.FC<AdminMatchModalProps> = ({
  isOpen,
  onClose,
  group,
  onFinalizeMatch,
}) => {
  const { t } = useTranslation();

  // Local state for the scores being inputted by admin
  const [scores, setScores] = useState<
    Record<
      number,
      { homeScore?: number; awayScore?: number; penaltyWinnerId?: number }
    >
  >({});
  const [isSubmitting, setIsSubmitting] = useState<number | null>(null);

  const handleScoreChange = (
    matchId: number,
    team: "home" | "away",
    value: string,
  ) => {
    const numValue = value === "" ? undefined : parseInt(value, 10);
    setScores((prev) => ({
      ...prev,
      [matchId]: {
        ...prev[matchId],
        [team === "home" ? "homeScore" : "awayScore"]: numValue,
      },
    }));
  };

  const handlePenaltyChange = (matchId: number, penaltyWinnerId: number) => {
    setScores((prev) => ({
      ...prev,
      [matchId]: {
        ...prev[matchId],
        penaltyWinnerId,
      },
    }));
  };

  const handleFinalize = async (matchId: number) => {
    const data = scores[matchId];
    if (!data || data.homeScore === undefined || data.awayScore === undefined)
      return;

    setIsSubmitting(matchId);
    try {
      await onFinalizeMatch(matchId, {
        homeScore: data.homeScore,
        awayScore: data.awayScore,
        penaltyWinnerId: data.penaltyWinnerId,
      });
      // Optionally show a success toast here
    } finally {
      setIsSubmitting(null);
    }
  };

  if (!group) return null;

  const isKnockout = !/^[A-L]$/.test(group.group);
  const titleText = isKnockout
    ? `${t(`dashboard.${group.group}`)} - FINAL RESULTS`
    : `${t("dashboard.groupStage").split(" ")[0] || "Group"} ${group.group} - FINAL RESULTS`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={titleText}>
      <div className="space-y-8">
        <div>
          <h3 className="text-sm font-bold text-muted-foreground uppercase mb-4 tracking-wider">
            {t("groupModal.matches")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {group.matches.map((game) => {
              const currentScore = scores[game.id] || {};
              const isReadyToSubmit =
                currentScore.homeScore !== undefined &&
                currentScore.awayScore !== undefined;

              return (
                <div
                  key={game.id}
                  className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-colors flex flex-col"
                >
                  <div className="bg-secondary/30 px-3 py-2 flex items-center justify-between border-b border-border/50">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${game.status === "FINISHED" ? "bg-red-500" : "bg-green-500 animate-pulse"}`}
                      />
                      <span className="text-[10px] font-bold text-foreground uppercase tracking-wider">
                        {game.status}
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
                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-xl shadow-sm ring-1 ring-border overflow-hidden">
                          <img
                            src={game.homeTeamFlag}
                            alt={`${game.homeTeam} flag`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span
                          className="font-bold text-xs text-center truncate w-full px-1"
                          title={game.homeTeam}
                        >
                          {game.homeTeam}
                        </span>
                      </div>

                      <span className="text-muted-foreground font-bold text-xs px-2">
                        VS
                      </span>

                      <div className="flex flex-col items-center gap-1 flex-1">
                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-xl shadow-sm ring-1 ring-border overflow-hidden">
                          <img
                            src={game.awayTeamFlag}
                            alt={`${game.awayTeam} flag`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span
                          className="font-bold text-xs text-center truncate w-full px-1"
                          title={game.awayTeam}
                        >
                          {game.awayTeam}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-2 bg-secondary/20 p-2 rounded-lg border border-border/30">
                      <JackpotScoreInput
                        value={currentScore.homeScore?.toString() ?? ""}
                        onChange={(val) =>
                          handleScoreChange(game.id, "home", val)
                        }
                        className="w-10 h-10 text-lg shadow-inner bg-background"
                      />
                      <span className="text-muted-foreground font-medium text-xs">
                        x
                      </span>
                      <JackpotScoreInput
                        value={currentScore.awayScore?.toString() ?? ""}
                        onChange={(val) =>
                          handleScoreChange(game.id, "away", val)
                        }
                        className="w-10 h-10 text-lg shadow-inner bg-background"
                      />
                    </div>

                    {isKnockout &&
                      currentScore.homeScore !== undefined &&
                      currentScore.homeScore === currentScore.awayScore && (
                        <div className="mt-2 text-xs flex flex-col items-center">
                          <span className="text-muted-foreground mb-1">
                            Penalty Winner:
                          </span>
                          <select
                            className="bg-card w-full p-2 rounded border border-border"
                            onChange={(e) =>
                              handlePenaltyChange(
                                game.id,
                                Number(e.target.value),
                              )
                            }
                            value={currentScore.penaltyWinnerId || ""}
                          >
                            <option value="" disabled>
                              Select winner
                            </option>
                            <option value="1">Home Team</option>
                            <option value="2">Away Team</option>
                          </select>
                        </div>
                      )}

                    <JackpotButton
                      variant={game.status === "FINISHED" ? "ghost" : "primary"}
                      onClick={() => handleFinalize(game.id)}
                      disabled={!isReadyToSubmit || isSubmitting === game.id}
                      className="mt-2 text-xs w-full"
                    >
                      {isSubmitting === game.id
                        ? "Submitting..."
                        : game.status === "FINISHED"
                          ? "Match Finalized"
                          : "Finalize Match"}
                    </JackpotButton>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Modal>
  );
};
