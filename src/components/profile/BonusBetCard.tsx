import { Trophy, Users } from "lucide-react";
import type { BonusBetDto } from "../../types/api";
import type { TFunction } from "i18next";

interface BonusBetCardProps {
  bonusBet: BonusBetDto | null | undefined;
  isMyProfile: boolean;
  t: TFunction;
}

export function BonusBetCard({
  bonusBet,
  isMyProfile,
  t,
}: BonusBetCardProps) {
  if (!bonusBet) {
    return (
      <div className="bg-card border border-border border-dashed rounded-xl p-8 flex flex-col items-center text-center">
        <Trophy className="w-12 h-12 text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-bold text-foreground mb-2">
          {t("profile.noBonusBetsTitle") || "No bonus predictions"}
        </h3>
        <p className="text-muted-foreground">
          {isMyProfile
            ? t("profile.noBonusMyProfile") ||
              "You haven't made any bonus predictions yet. Go to the dashboard to make your picks!"
            : t("profile.noBonusOtherProfile") ||
              "This user hasn't made any bonus predictions yet."}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6 md:p-8 space-y-6">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
        <Trophy className="w-6 h-6 text-yellow-500" />
        <h2 className="text-xl font-bold text-foreground">
          {t("profile.bonusPredictions") || "Bonus Predictions"}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Champion */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <span className="text-sm font-black text-yellow-500">🏆</span>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                {t("dashboard.champion") || "Champion"}
              </p>
              <p className="text-xs font-semibold text-yellow-500 bg-yellow-500/10 w-fit px-2 py-0.5 rounded mt-1">
                +50 pts
              </p>
            </div>
          </div>
          <p className="text-lg font-bold text-foreground">
            {bonusBet.championTeamName}
          </p>
        </div>

        {/* Runner-Up */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
              <span className="text-sm font-black text-blue-500">🥈</span>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                {t("dashboard.viceChampion") || "Runner-up"}
              </p>
              <p className="text-xs font-semibold text-blue-500 bg-blue-500/10 w-fit px-2 py-0.5 rounded mt-1">
                +25 pts
              </p>
            </div>
          </div>
          <p className="text-lg font-bold text-foreground">
            {bonusBet.runnerUpTeamName}
          </p>
        </div>

        {/* Top Scorer */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center">
              <span className="text-sm font-black text-orange-500">⚽</span>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                {t("dashboard.topScorer") || "Top Scorer"}
              </p>
              <p className="text-xs font-semibold text-orange-500 bg-orange-500/10 w-fit px-2 py-0.5 rounded mt-1">
                +70 pts
              </p>
            </div>
          </div>
          <p className="text-lg font-bold text-foreground">
            {bonusBet.topScorer}
          </p>
        </div>
      </div>

      {/* Info Footer */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary/30 border border-border/50 rounded-lg px-3 py-2 mt-4">
        <Users className="w-3.5 h-3.5 shrink-0" />
        <span>
          {t("profile.bonusInfo") ||
            "Maximum of 145 points (Champion + Runner-up + Top Scorer)"}
        </span>
      </div>
    </div>
  );
}
