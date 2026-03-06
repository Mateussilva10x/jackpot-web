import { useTranslation } from "react-i18next";
import { Trophy } from "lucide-react";
import { RankingRow } from "./RankingRow";
import type { UserRankingDto } from "../../types/api";

export interface RankingTableProps {
  users: UserRankingDto[];
  currentUserId?: number;
  isLoading: boolean;
  error: string | null;
}

export function RankingTable({
  users,
  currentUserId,
  isLoading,
  error,
}: RankingTableProps) {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="w-full max-w-3xl mx-auto flex flex-col gap-3">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold text-foreground">
            {t("ranking.leaderboard") || "Leaderboard"}
          </h2>
        </div>
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-20 bg-card border border-border rounded-xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-3xl mx-auto p-6 bg-red-500/10 border border-red-500/20 rounded-xl text-center">
        <p className="text-red-500 font-medium">
          {error || t("common.error") || "An error occurred"}
        </p>
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="w-full max-w-3xl mx-auto p-12 bg-card border border-border rounded-xl border-dashed text-center flex flex-col items-center">
        <Trophy className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
        <h3 className="text-xl font-bold text-foreground mb-2">
          {t("ranking.emptyTitle") || "No rankings yet"}
        </h3>
        <p className="text-muted-foreground">
          {t("ranking.emptyDescription") ||
            "The leaderboard will populate once scores are calculated."}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Trophy className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-bold text-foreground">
          {t("ranking.leaderboard") || "Leaderboard"}
        </h2>
      </div>

      <div className="flex flex-col gap-3">
        {users.map((user) => (
          <RankingRow
            key={user.id}
            user={user}
            isCurrentUser={user.id === currentUserId}
          />
        ))}
      </div>
    </div>
  );
}
