import React, { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { Modal } from "../ui/Modal";
import { JackpotScoreInput } from "../ui/JackpotScoreInput";
import { JackpotButton } from "../ui/JackpotButton";
import { useTranslation } from "react-i18next";
import { formatMatchDateTime } from "../../utils/formatDate";

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

  const [scores, setScores] = useState<
    Record<
      number,
      { homeScore?: number; awayScore?: number; penaltyWinnerId?: number }
    >
  >({});
  const [isSubmitting, setIsSubmitting] = useState<number | null>(null);

  useEffect(() => {
    if (group) {
      const initialScores: Record<
        number,
        { homeScore?: number; awayScore?: number; penaltyWinnerId?: number }
      > = {};
      group.matches.forEach((m) => {
        if (
          m.status === "FINISHED" &&
          m.officialHomeScore !== undefined &&
          m.officialAwayScore !== undefined
        ) {
          initialScores[m.id] = {
            homeScore: m.officialHomeScore,
            awayScore: m.officialAwayScore,
          };
        }
      });
      setScores(initialScores);
    }
  }, [group, isOpen]);

  const handleScoreChange = (
    matchId: number,
    team: "home" | "away",
    value: string,
  ) => {
    const numValue = value === "" ? undefined : parseInt(value, 10);
    setScores((prev) => {
      const current = prev[matchId] || {};
      const updatedHomeScore = team === "home" ? numValue : current.homeScore;
      const updatedAwayScore = team === "away" ? numValue : current.awayScore;

      // penaltyWinnerId só vale enquanto o placar oficial for empate; qualquer
      // placar decidido (ou incompleto) limpa o vencedor.
      const isDraw =
        updatedHomeScore !== undefined &&
        updatedAwayScore !== undefined &&
        updatedHomeScore === updatedAwayScore;
      const penaltyWinnerId = isDraw ? current.penaltyWinnerId : undefined;

      return {
        ...prev,
        [matchId]: {
          ...current,
          [team === "home" ? "homeScore" : "awayScore"]: numValue,
          penaltyWinnerId,
        },
      };
    });
  };

  // teamId = ID real do time (match.homeTeamId / match.awayTeamId)
  const handleFlagClick = (matchId: number, teamId: number) => {
    setScores((prev) => {
      const currentScore = prev[matchId];
      if (
        currentScore &&
        currentScore.homeScore !== undefined &&
        currentScore.awayScore !== undefined &&
        currentScore.homeScore === currentScore.awayScore
      ) {
        return {
          ...prev,
          [matchId]: {
            ...currentScore,
            penaltyWinnerId: teamId,
          },
        };
      }
      return prev;
    });
  };

  const handleFinalize = async (matchId: number) => {
    const data = scores[matchId];
    if (!data || data.homeScore === undefined || data.awayScore === undefined)
      return;

    // penaltyWinnerId só é enviado quando o placar oficial é empate.
    const isDraw = data.homeScore === data.awayScore;

    setIsSubmitting(matchId);
    try {
      await onFinalizeMatch(matchId, {
        homeScore: data.homeScore,
        awayScore: data.awayScore,
        penaltyWinnerId: isDraw ? data.penaltyWinnerId : undefined,
      });
    } finally {
      setIsSubmitting(null);
    }
  };

  if (!group) return null;

  const isKnockout = !/^[A-L]$/.test(group.group);
  const titleText = isKnockout
    ? `${t(`dashboard.${group.group}`)} - ${t("admin.finalResults")}`
    : `${t("groupModal.groupLabel")} ${group.group} - ${t("admin.finalResults")}`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={titleText}>
      <div className="space-y-8">
        <div>
          <h3 className="text-sm font-bold text-muted-foreground uppercase mb-4 tracking-wider">
            {t("groupModal.matches")}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {group.matches.map((game) => {
              const currentScore = scores[game.id] || {};
              const isFinished = game.status === "FINISHED";
              const isReadyToSubmit =
                currentScore.homeScore !== undefined &&
                currentScore.awayScore !== undefined &&
                (!isKnockout ||
                  currentScore.homeScore !== currentScore.awayScore ||
                  currentScore.penaltyWinnerId !== undefined);

              return (
                <div
                  key={game.id}
                  className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-colors flex flex-col"
                >
                  <div className="bg-secondary/30 px-3 py-2 flex items-center justify-between border-b border-border/50">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${isFinished ? "bg-red-500" : "bg-green-500 animate-pulse"}`}
                      />
                      <span className="text-[10px] font-bold text-foreground uppercase tracking-wider">
                        {game.status}
                      </span>
                    </div>
                    <div className="text-[10px] font-mono text-muted-foreground">
                      {(() => {
                        const { date, time } = formatMatchDateTime(
                          game.dateTime,
                        );
                        return `${date} • ${time}`;
                      })()}
                    </div>
                  </div>

                  <div className="p-3 sm:p-4 flex flex-col gap-3 sm:gap-4">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col items-center gap-1 flex-1">
                        <div className="w-8 h-6 bg-secondary flex items-center justify-center text-xl shadow-sm overflow-hidden ring-1 ring-border">
                          <img
                            src={game.homeTeamFlag}
                            alt={`${game.homeTeam} flag`}
                            className="w-full h-full object-contain"
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
                        <div className="w-8 h-6 bg-secondary flex items-center justify-center text-xl shadow-sm overflow-hidden ring-1 ring-border">
                          <img
                            src={game.awayTeamFlag}
                            alt={`${game.awayTeam} flag`}
                            className="w-full h-full object-contain"
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

                    {/* Official result badge for FINISHED matches */}
                    {isFinished &&
                      game.officialHomeScore !== undefined &&
                      game.officialAwayScore !== undefined && (
                        <div className="flex items-center justify-center gap-1 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-1.5">
                          <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider mr-1">
                            {t("admin.officialResultLabel")}
                          </span>
                          <span className="text-base font-black text-foreground">
                            {game.officialHomeScore}
                          </span>
                          <span className="text-muted-foreground font-bold text-xs">
                            x
                          </span>
                          <span className="text-base font-black text-foreground">
                            {game.officialAwayScore}
                          </span>
                        </div>
                      )}

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

                    {/* Mata-mata empatado → admin define quem avançou (pênaltis) */}
                    {isKnockout &&
                      currentScore.homeScore !== undefined &&
                      currentScore.awayScore !== undefined &&
                      currentScore.homeScore === currentScore.awayScore && (
                        <div className="bg-accent/5 border border-accent/30 rounded-lg p-2.5 flex flex-col gap-2">
                          <p className="text-[10px] font-bold text-accent uppercase tracking-wider text-center">
                            {t("admin.whoAdvanced", "Quem avançou? (pênaltis)")}
                          </p>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { id: game.homeTeamId, name: game.homeTeam },
                              { id: game.awayTeamId, name: game.awayTeam },
                            ].map((team) => {
                              const selected =
                                team.id != null &&
                                currentScore.penaltyWinnerId === team.id;
                              return (
                                <button
                                  key={team.id}
                                  type="button"
                                  onClick={() =>
                                    handleFlagClick(game.id, team.id)
                                  }
                                  className={`flex items-center justify-center gap-1 text-[11px] font-bold px-2 py-1.5 rounded-md border-2 transition-all truncate ${
                                    selected
                                      ? "bg-accent border-accent text-accent-foreground ring-2 ring-accent/40 shadow-sm"
                                      : "bg-background border-border text-muted-foreground hover:border-accent/50 hover:text-foreground"
                                  }`}
                                  title={team.name}
                                >
                                  {selected && (
                                    <Check className="w-3 h-3 shrink-0" />
                                  )}
                                  <span className="truncate">{team.name}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                    <JackpotButton
                      variant={isFinished ? "ghost" : "primary"}
                      onClick={() => handleFinalize(game.id)}
                      disabled={!isReadyToSubmit || isSubmitting === game.id}
                      className="mt-2 text-xs w-full"
                    >
                      {isSubmitting === game.id
                        ? t("admin.submitting")
                        : isFinished
                          ? t("admin.updateResult")
                          : t("admin.finalizeMatch")}
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
