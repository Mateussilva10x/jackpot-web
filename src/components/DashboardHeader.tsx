import { useState, useEffect } from "react";
import { Trophy, Medal, Target } from "lucide-react";
import { betsService } from "../services/betsService";
import { teamsService } from "../services/teamsService";
import type { BonusBetRequest, TeamDto } from "../types/api";
import { useTranslation } from "react-i18next";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function Countdown() {
  const { t } = useTranslation();
  const targetDate = new Date("2026-06-11T00:00:00").getTime();
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
  const [bonusBet, setBonusBet] = useState<BonusBetRequest>({
    championTeamId: 0,
    runnerUpTeamId: 0,
    topScorer: "",
  });
  const [teams, setTeams] = useState<TeamDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [betData, teamsData] = await Promise.all([
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
      ]);

      if (betData) {
        setBonusBet({
          championTeamId: betData.championTeamId || 0,
          runnerUpTeamId: betData.runnerUpTeamId || 0,
          topScorer: betData.topScorer || "",
        });
      }

      if (teamsData) {
        setTeams(teamsData);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await betsService.placeBonusBet(bonusBet);
      alert(t("dashboard.bonusSavedSuccess"));
    } catch (e) {
      console.error("Failed to save bonus bet", e);
      alert(t("dashboard.bonusSavedError"));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-green-500" />
          <h2 className="text-lg font-bold text-foreground">
            {t("dashboard.bonusPredictions")}
          </h2>
          <span className="text-sm text-muted-foreground ml-2">
            {t("dashboard.bonusPoints")}
          </span>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving || isLoading}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {isSaving ? t("dashboard.saving") : t("dashboard.saveBonus")}
        </button>
      </div>

      {isLoading ? (
        <div className="py-10 flex justify-center items-center text-muted-foreground">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mr-3"></div>
          {t("dashboard.loadingBonus")}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <BonusCard
            icon={<Trophy className="w-6 h-6 text-yellow-500" />}
            title={t("dashboard.champion")}
            subtitle={t("dashboard.championSubtitle")}
            placeholder={t("dashboard.selectTeam")}
            value={bonusBet.championTeamId}
            onChange={(e) =>
              setBonusBet((prev) => ({
                ...prev,
                championTeamId: parseInt(e.target.value, 10),
              }))
            }
            options={teams}
          />
          <BonusCard
            icon={<Medal className="w-6 h-6 text-gray-400" />}
            title={t("dashboard.viceChampion")}
            subtitle={t("dashboard.viceSubtitle")}
            placeholder={t("dashboard.selectTeam")}
            value={bonusBet.runnerUpTeamId}
            onChange={(e) =>
              setBonusBet((prev) => ({
                ...prev,
                runnerUpTeamId: parseInt(e.target.value, 10),
              }))
            }
            options={teams}
          />
          <BonusCard
            icon={<Target className="w-6 h-6 text-blue-500" />}
            title={t("dashboard.topScorer")}
            subtitle={t("dashboard.topScorerSubtitle")}
            isInput
            placeholder={t("dashboard.enterPlayer")}
            value={bonusBet.topScorer}
            onChange={(e) =>
              setBonusBet((prev) => ({ ...prev, topScorer: e.target.value }))
            }
          />
        </div>
      )}
    </div>
  );
}

interface BonusCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  placeholder: string;
  isInput?: boolean;
  value: string | number;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  options?: { id: number; name: string }[];
}

function BonusCard({
  icon,
  title,
  subtitle,
  placeholder,
  isInput,
  value,
  onChange,
  options,
}: BonusCardProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 hover:border-primary/50 transition-colors group">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-secondary rounded-lg group-hover:bg-secondary/80 transition-colors">
          {icon}
        </div>
        <div>
          <h3 className="font-bold text-foreground">{title}</h3>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </div>

      {isInput ? (
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full bg-secondary/50 border border-input rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/50"
        />
      ) : (
        <select
          value={value}
          onChange={onChange}
          className="w-full bg-secondary/50 border border-input rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none cursor-pointer"
        >
          <option value="0" disabled>
            {placeholder}
          </option>
          {options?.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
