import { useState, useEffect, useMemo } from "react";
import { rankingService } from "../../services/rankingService";
import { RankingTable } from "../../components/ranking/RankingTable";
import { useAuth } from "../../contexts/AuthContext";
import type { UserRankingDto } from "../../types/api";

export default function AppRanking() {
  const { user } = useAuth();
  const [data, setData] = useState<UserRankingDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchRanking() {
      try {
        setIsLoading(true);
        setError(null);
        const rankings = await rankingService.getRanking();

        if (isMounted) {
          setData(rankings.content);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Failed to load ranking", err);
          setError("Failed to load leaderboard");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchRanking();

    return () => {
      isMounted = false;
    };
  }, []);

  const sortedRanking = useMemo(() => {
    if (!data.length) return [];

    const sorted = [...data].sort((a, b) => {
      if (b.totalPoints !== a.totalPoints) {
        return b.totalPoints - a.totalPoints;
      }
      return a.name.localeCompare(b.name);
    });

    let rankToReturn = 1;
    let prevPoints: number | null = null;

    return sorted.map((item, index) => {
      if (prevPoints === null) {
        prevPoints = item.totalPoints;
      } else if (item.totalPoints < prevPoints) {
        rankToReturn = index + 1;
        prevPoints = item.totalPoints;
      }

      return {
        ...item,
        rankingPosition: rankToReturn,
      };
    });
  }, [data]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <RankingTable
        users={sortedRanking}
        isLoading={isLoading}
        error={error}
        currentUserId={user ? Number(user.id) : undefined}
      />
    </div>
  );
}
