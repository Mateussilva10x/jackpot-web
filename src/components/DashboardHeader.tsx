import { useState, useEffect } from "react";
import { Trophy, Lock } from "lucide-react";
import { betsService } from "../services/betsService";
import { teamsService } from "../services/teamsService";
import { matchesService } from "../services/matchesService";
import { JackpotButton } from "./ui/JackpotButton";
import type {
  BonusBetRequest,
  TeamDto,
  MatchGroupResponse,
} from "../types/api";
import { useTranslation } from "react-i18next";
import { useToast } from "../hooks/useToast";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function Countdown() {
  const { t } = useTranslation();
  const targetDate = new Date("2026-06-11T00:00:00Z").getTime();
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(interval);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        ),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="w-full bg-card border border-border rounded-xl p-6 mb-8 mt-16 md:mt-0">
      <div className="flex items-center gap-2 mb-6 text-primary">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <span className="text-sm font-medium tracking-wide uppercase">
          {t("dashboard.untilWorldCup")}
        </span>
      </div>

      <div className="flex justify-center items-center gap-4 md:gap-8">
        <TimeUnit value={timeLeft.days} label={t("dashboard.days")} />
        <span className="text-4xl font-bold text-muted-foreground pb-6">:</span>
        <TimeUnit value={timeLeft.hours} label={t("dashboard.hours")} />
        <span className="text-4xl font-bold text-muted-foreground pb-6">:</span>
        <TimeUnit value={timeLeft.minutes} label={t("dashboard.minutes")} />
        <span className="text-4xl font-bold text-muted-foreground pb-6">:</span>
        <TimeUnit value={timeLeft.seconds} label={t("dashboard.seconds")} />
      </div>
    </div>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-secondary/50 rounded-lg p-3 md:p-4 min-w-[30px] md:min-w-[100px] flex items-center justify-center mb-2">
        <span className="text-2xl md:text-5xl font-bold tabular-nums text-foreground">
          {value.toString().padStart(2, "0")}
        </span>
      </div>
      <span className="text-xs md:text-sm text-muted-foreground font-medium uppercase">
        {label}
      </span>
    </div>
  );
}

export function BonusPredictions() {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [bonusBet, setBonusBet] = useState<BonusBetRequest>({
    championTeamId: 0,
    runnerUpTeamId: 0,
    topScorer: "",
  });
  const [teams, setTeams] = useState<TeamDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [firstMatchTime, setFirstMatchTime] = useState<Date | null>(null);
  const [hasDefinedBet, setHasDefinedBet] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!firstMatchTime) return;
    const interval = setInterval(() => {
      setIsLocked(Date.now() >= firstMatchTime.getTime());
    }, 30_000);
    return () => clearInterval(interval);
  }, [firstMatchTime]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [betData, teamsData, matchesData] = await Promise.all([
        betsService.getBonusBet().catch((e) => {
          if (e.response?.status !== 404) {
            console.error("Failed to load bonus bet", e);
          }
          return null;
        }),
        teamsService.getTeams().catch((e) => {
          console.error("Failed to load teams", e);
          return [];
        }),
        matchesService.getMatches().catch((e: unknown) => {
          console.error("Failed to load matches for lock check", e);
          return [] as MatchGroupResponse[];
        }),
      ]);

      if (betData) {
        setBonusBet({
          championTeamId: betData.championTeamId || 0,
          runnerUpTeamId: betData.runnerUpTeamId || 0,
          topScorer: betData.topScorer || "",
        });
        setHasDefinedBet(true);
      } else {
        setHasDefinedBet(false);
      }

      if (teamsData) {
        setTeams(
          teamsData.sort((a: TeamDto, b: TeamDto) =>
            a.name.localeCompare(b.name),
          ),
        );
      }

      if (matchesData && matchesData.length > 0) {
        const allMatchTimes = matchesData
          .flatMap((g: MatchGroupResponse) => g.matches)
          .map((m: { dateTime: string }) => new Date(m.dateTime).getTime())
          .filter((ts: number) => !isNaN(ts));

        if (allMatchTimes.length > 0) {
          const earliest = new Date(Math.min(...allMatchTimes));
          setFirstMatchTime(earliest);
          setIsLocked(Date.now() >= earliest.getTime());
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (isLocked) return;
    try {
      setIsSaving(true);
      await betsService.placeBonusBet(bonusBet);
      setHasDefinedBet(true);
      showToast(t("dashboard.bonusSavedSuccess"), "success");
    } catch (e) {
      console.error("Failed to save bonus bet", e);
      showToast(t("dashboard.bonusSavedError"), "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 mb-8 mt-8 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <div>
            <h2 className="text-xl font-bold text-foreground">
              {t("dashboard.bonusPredictions")}
            </h2>
          </div>
        </div>
        {isLocked ? (
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary/50 border border-border px-3 py-2 rounded-lg">
            <Lock className="w-3.5 h-3.5" />
            <span>
              {t("dashboard.bonusLocked", "Apostas encerradas")}{" "}
              {firstMatchTime &&
                firstMatchTime.toLocaleDateString(undefined, {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
            </span>
          </div>
        ) : null}
      </div>

      {isLoading ? (
        <div className="py-10 flex justify-center items-center text-muted-foreground">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mr-3"></div>
          {t("dashboard.loadingBonus")}
        </div>
      ) : (
        <>
          <div
            className={`grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 ${isLocked ? "opacity-60 pointer-events-none select-none" : ""}`}
          >
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold flex items-center gap-2">
                {t("dashboard.champion")}{" "}
                <span className="text-xs font-semibold text-yellow-500 bg-yellow-500/10 px-1.5 py-0.5 rounded">
                  +50 pts
                </span>
              </label>
              <select
                value={bonusBet.championTeamId}
                onChange={(e) =>
                  setBonusBet((prev) => ({
                    ...prev,
                    championTeamId: parseInt(e.target.value, 10),
                  }))
                }
                disabled={isLocked}
                className="p-3 rounded-lg bg-background border border-border outline-none focus:border-primary transition-colors disabled:cursor-not-allowed"
              >
                <option value="0" disabled>
                  {t("dashboard.selectTeam")}
                </option>
                {teams
                  .filter((tm) => tm.id !== bonusBet.runnerUpTeamId)
                  .map((tm) => (
                    <option key={tm.id} value={tm.id}>
                      {t(`teams.${tm.name}`)}
                    </option>
                  ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold flex items-center gap-2">
                {t("dashboard.viceChampion")}{" "}
                <span className="text-xs font-semibold text-yellow-500 bg-yellow-500/10 px-1.5 py-0.5 rounded">
                  +25 pts
                </span>
              </label>
              <select
                value={bonusBet.runnerUpTeamId}
                onChange={(e) =>
                  setBonusBet((prev) => ({
                    ...prev,
                    runnerUpTeamId: parseInt(e.target.value, 10),
                  }))
                }
                disabled={isLocked}
                className="p-3 rounded-lg bg-background border border-border outline-none focus:border-primary transition-colors disabled:cursor-not-allowed"
              >
                <option value="0" disabled>
                  {t("dashboard.selectTeam")}
                </option>
                {teams
                  .filter((tm) => tm.id !== bonusBet.championTeamId)
                  .map((tm) => (
                    <option key={tm.id} value={tm.id}>
                      {t(`teams.${tm.name}`)}
                    </option>
                  ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold flex items-center gap-2">
                {t("dashboard.topScorer")}{" "}
                <span className="text-xs font-semibold text-yellow-500 bg-yellow-500/10 px-1.5 py-0.5 rounded">
                  +70 pts
                </span>
              </label>
              <input
                type="text"
                value={bonusBet.topScorer}
                onChange={(e) =>
                  setBonusBet((prev) => ({
                    ...prev,
                    topScorer: e.target.value,
                  }))
                }
                placeholder={t("dashboard.enterPlayer")}
                disabled={isLocked}
                className="p-3 rounded-lg bg-background border border-border outline-none focus:border-primary transition-colors disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <div className="flex justify-end items-center gap-4">
            {!isLocked && (
              <JackpotButton
                variant="primary"
                onClick={handleSave}
                disabled={
                  isSaving ||
                  isLoading ||
                  !bonusBet.championTeamId ||
                  !bonusBet.runnerUpTeamId ||
                  !bonusBet.topScorer.trim()
                }
              >
                {isSaving
                  ? t("dashboard.saving")
                  : hasDefinedBet
                    ? t("dashboard.updateBonus")
                    : t("dashboard.saveBonus")}
              </JackpotButton>
            )}
          </div>
        </>
      )}
    </div>
  );
}
