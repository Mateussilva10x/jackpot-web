import { useState, useEffect } from "react";
import { api } from "../../services/api";
import { adminService } from "../../services/adminService";
import { JackpotButton } from "../ui/JackpotButton";
import { useTranslation } from "react-i18next";
import type { TeamDto } from "../../types/api";

export const AdminBonusResolution = () => {
  const { t } = useTranslation();
  const [teams, setTeams] = useState<TeamDto[]>([]);
  const [championTeamId, setChampionTeamId] = useState<number | "">("");
  const [runnerUpTeamId, setRunnerUpTeamId] = useState<number | "">("");
  const [topScorer, setTopScorer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await api.get("/teams");
        setTeams(response.data);
      } catch (err) {
        console.error("Failed to fetch teams", err);
      }
    };
    fetchTeams();
  }, []);

  const handleResolve = async () => {
    if (!championTeamId || !runnerUpTeamId || !topScorer.trim()) return;

    setIsLoading(true);
    setSuccess(false);
    try {
      await adminService.resolveBonusBets({
        championTeamId: Number(championTeamId),
        runnerUpTeamId: Number(runnerUpTeamId),
        topScorer,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to resolve bonus bets", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 mb-8 mt-8 shadow-sm">
      <h2 className="text-xl font-bold mb-4">{t("admin.bonusTitle")}</h2>
      <p className="text-sm text-muted-foreground mb-6">
        {t("admin.bonusSubtitle")}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold">{t("admin.champion")}</label>
          <select
            value={championTeamId}
            onChange={(e) => setChampionTeamId(Number(e.target.value))}
            className="p-3 rounded-lg bg-background border border-border outline-none focus:border-primary transition-colors"
          >
            <option value="" disabled>
              {t("admin.selectChampion")}
            </option>
            {teams.map((tm) => (
              <option key={tm.id} value={tm.id}>
                {tm.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold">{t("admin.runnerUp")}</label>
          <select
            value={runnerUpTeamId}
            onChange={(e) => setRunnerUpTeamId(Number(e.target.value))}
            className="p-3 rounded-lg bg-background border border-border outline-none focus:border-primary transition-colors"
          >
            <option value="" disabled>
              {t("admin.selectRunnerUp")}
            </option>
            {teams.map((tm) => (
              <option key={tm.id} value={tm.id}>
                {tm.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold">{t("admin.topScorer")}</label>
          <input
            type="text"
            value={topScorer}
            onChange={(e) => setTopScorer(e.target.value)}
            placeholder={t("admin.playerNamePlaceholder")}
            className="p-3 rounded-lg bg-background border border-border outline-none focus:border-primary transition-colors"
          />
        </div>
      </div>

      <div className="flex justify-end items-center gap-4">
        {success && (
          <span className="text-green-500 font-bold text-sm">
            {t("admin.resolvedSuccess")}
          </span>
        )}
        <JackpotButton
          variant="primary"
          onClick={handleResolve}
          disabled={
            !championTeamId || !runnerUpTeamId || !topScorer.trim() || isLoading
          }
        >
          {isLoading ? t("admin.resolving") : t("admin.resolveBonusBets")}
        </JackpotButton>
      </div>
    </div>
  );
};
