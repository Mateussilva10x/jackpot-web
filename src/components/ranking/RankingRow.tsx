import { Link } from "react-router-dom";
import { Trophy, Medal, Crosshair, PieChart, Volleyball } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { UserRankingDto } from "../../types/api";
import { getAvatarById } from "../../utils/avatar";

export interface RankingRowProps {
  user: UserRankingDto;
  isCurrentUser: boolean;
}

export function RankingRow({ user, isCurrentUser }: RankingRowProps) {
  const { t } = useTranslation();
  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Medal className="w-5 h-5 text-amber-700" />;
      default:
        return (
          <span className="text-sm font-medium text-muted-foreground w-5 text-center">
            #{position}
          </span>
        );
    }
  };

  const getRowStyle = (position: number, isCurrent: boolean) => {
    const baseStyle =
      "flex items-center justify-between p-4 rounded-xl border transition-all";

    if (isCurrent) {
      return `${baseStyle} border-green-500 bg-green-500/10 shadow-sm relative z-10`;
    }

    switch (position) {
      case 1:
        return `${baseStyle} border-yellow-500/50 bg-yellow-500/5 hover:border-yellow-500 transition-colors`;
      case 2:
        return `${baseStyle} border-gray-400/50 bg-gray-400/5 hover:border-gray-400 transition-colors`;
      case 3:
        return `${baseStyle} border-amber-700/50 bg-amber-700/5 hover:border-amber-700 transition-colors`;
      default:
        return `${baseStyle} border-border bg-card hover:border-primary/50 transition-colors`;
    }
  };

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n: string) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "??";

  const resolvedAvatar = user.avatarId ?? user.avatar;

  return (
    <div className={getRowStyle(user.rankingPosition, isCurrentUser)}>
      <div className="flex items-center gap-4">
        <div className="w-8 flex justify-center">
          {getPositionIcon(user.rankingPosition)}
        </div>

        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border border-border overflow-hidden ${resolvedAvatar ? "bg-background" : "bg-secondary"}`}
          >
            <span
              className={`font-black ${resolvedAvatar ? "text-2xl" : "text-sm text-foreground"}`}
            >
              {getAvatarById(resolvedAvatar) || initials}
            </span>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <Link
                to={`/profile/${user.id}`}
                className="font-bold text-foreground hover:text-primary transition-colors hover:underline"
              >
                {user.name}
              </Link>
              {isCurrentUser && (
                <span className="bg-green-500/20 text-green-500 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {t("common.you")}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              {typeof user.exactScores === "number" && (
                <span
                  className="flex items-center gap-1 text-xs font-bold text-green-500"
                  title={t("ranking.exactScoresTooltip")}
                >
                  <Crosshair className="w-3.5 h-3.5 shrink-0" />
                  {user.exactScores}
                </span>
              )}
              {typeof user.partialScores === "number" && (
                <span
                  className="flex items-center gap-1 text-xs font-bold text-amber-500"
                  title={t("ranking.partialScoresTooltip")}
                >
                  <PieChart className="w-3.5 h-3.5 shrink-0" />
                  {user.partialScores}
                </span>
              )}
              {typeof user.justGoals === "number" && (
                <span
                  className="flex items-center gap-1 text-xs font-bold text-muted-foreground"
                  title={t("ranking.justGoalsTooltip")}
                >
                  <Volleyball className="w-3.5 h-3.5 shrink-0" />
                  {user.justGoals}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-baseline gap-1">
        <span className="text-xl font-black text-foreground">
          {user.totalPoints}
        </span>
        <span className="text-xs font-medium text-muted-foreground uppercase">
          pts
        </span>
      </div>
    </div>
  );
}
