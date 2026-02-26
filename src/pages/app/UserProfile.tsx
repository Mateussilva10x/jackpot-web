import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import { useAuth } from "../../contexts/AuthContext";
import { userService } from "../../services/userService";
import type { UserProfileDto, MatchGroupResponse } from "../../types/api";
import {
  Trophy,
  ArrowLeft,
  User,
  Calendar,
  Target,
  Camera,
} from "lucide-react";
import { AvatarSelectionModal } from "../../components/profile/AvatarSelectionModal";
import { getAvatarById } from "../../utils/avatar";

export default function UserProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user: currentUser } = useAuth();

  const [profile, setProfile] = useState<UserProfileDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  const isMyProfile =
    id === undefined || id === currentUser?.id?.toString() || id === "me";

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      try {
        setIsLoading(true);
        setError(null);

        let data: UserProfileDto;
        if (isMyProfile) {
          data = await userService.getMyProfile();
        } else {
          data = await userService.getUserProfile(id as string);
        }

        if (isMounted) {
          setProfile(data);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Failed to load user profile", err);
          setError(t("profile.errorLoading") || "Failed to load user profile");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [id, isMyProfile, t]);

  const handleSaveAvatar = async (newAvatarId: number) => {
    try {
      await userService.updateAvatar(newAvatarId);

      if (profile) {
        setProfile({ ...profile, avatarId: newAvatarId, avatar: newAvatarId });
      }
      setIsAvatarModalOpen(false);
    } catch (err) {
      console.error("Failed to update avatar", err);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("common.back")}
        </button>

        {/* Skeleton Header */}
        <div className="bg-card border border-border rounded-xl p-6 md:p-8 mb-8 animate-pulse">
          <div className="flex flex-col md:flex-row gap-6 md:items-center">
            <div className="w-24 h-24 rounded-full bg-secondary shrink-0" />
            <div className="flex-1 space-y-4">
              <div className="h-8 bg-secondary rounded w-1/3" />
              <div className="h-4 bg-secondary rounded w-1/4" />
            </div>
          </div>
        </div>

        {/* Skeleton Matches */}
        <div className="space-y-4 animate-pulse">
          <div className="h-40 bg-card border border-border rounded-xl" />
          <div className="h-40 bg-card border border-border rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("common.back")}
        </button>

        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-8 text-center">
          <p className="text-red-500 font-medium mb-4">
            {error || "User not found"}
          </p>
          <button
            onClick={() => navigate("/app/ranking")}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-bold"
          >
            {t("profile.goToRanking") || "Back to Ranking"}
          </button>
        </div>
      </div>
    );
  }

  const initials = profile.name
    ? profile.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "??";

  const resolvedAvatar = profile.avatarId ?? profile.avatar;

  const totalBets =
    profile.bets?.reduce((acc, group) => {
      return (
        acc +
        group.matches.filter(
          (m) => m.userBet !== null && m.userBet !== undefined,
        ).length
      );
    }, 0) || 0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        {t("common.back")}
      </button>

      {/* Profile Header Block */}
      <div className="bg-card border border-border rounded-xl p-6 md:p-8 mb-8 relative overflow-hidden">
        {/* Decorative background gradient */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left">
          <div className="relative group">
            <div
              className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center border-4 border-card outline outline-1 outline-border shrink-0 shadow-lg overflow-hidden ${resolvedAvatar ? "bg-background" : "bg-secondary"}`}
            >
              <span className="text-3xl sm:text-5xl font-black text-foreground">
                {getAvatarById(resolvedAvatar) || initials}
              </span>
            </div>

            {isMyProfile && (
              <button
                onClick={() => setIsAvatarModalOpen(true)}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer border-4 border-transparent hover:border-primary/50"
                title={t("profile.changeAvatar") || "Change Avatar"}
              >
                <Camera className="w-8 h-8 text-white mb-1" />
                <span className="text-[10px] sm:text-xs font-bold text-white uppercase tracking-wider">
                  {t("common.edit") || "Edit"}
                </span>
              </button>
            )}
          </div>

          <div className="flex-1 flex flex-col md:flex-row items-center md:items-center justify-between w-full">
            <div className="mb-6 md:mb-0">
              <h1 className="text-2xl sm:text-3xl font-black text-foreground mb-1 flex items-center justify-center md:justify-start gap-3">
                {profile.name}
                {isMyProfile && (
                  <span className="bg-green-500/20 text-green-500 text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wide">
                    {t("profile.you") || "You"}
                  </span>
                )}
              </h1>
              {profile.email && (
                <p className="text-muted-foreground flex items-center justify-center md:justify-start gap-2 text-sm">
                  <User className="w-4 h-4" /> {profile.email}
                </p>
              )}
            </div>

            <div className="flex items-center gap-6">
              <div className="flex flex-col items-center p-4 bg-secondary/50 rounded-xl min-w-[100px]">
                <span className="text-2xl font-black text-foreground flex items-center gap-1.5">
                  <Trophy className="w-5 h-5 text-yellow-500" />#
                  {profile.rankingPosition}
                </span>
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t("profile.position") || "Position"}
                </span>
              </div>

              <div className="flex flex-col items-center p-4 bg-secondary/50 rounded-xl min-w-[100px]">
                <span className="text-2xl font-black text-primary">
                  {profile.totalPoints}
                </span>
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t("ranking.pts") || "Points"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bets Section Overview */}
      <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
        <Target className="w-5 h-5 text-primary" />
        {t("profile.predictions") || "Predictions"}
        <span className="bg-secondary text-foreground text-xs font-bold px-2 py-0.5 rounded-full ml-2">
          {totalBets} {t("profile.totalBets") || "Total Bets"}
        </span>
      </h2>

      {/* Group Bets Grid */}
      {!profile.bets || profile.bets.length === 0 ? (
        <div className="bg-card border border-border border-dashed rounded-xl p-12 flex flex-col items-center text-center">
          <Calendar className="w-12 h-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-bold text-foreground mb-2">
            {t("profile.noBetsTitle") || "No predictions found"}
          </h3>
          <p className="text-muted-foreground">
            {isMyProfile
              ? t("profile.noBetsMyProfile") ||
                "You haven't made any predictions yet. Head to the dashboard to start betting!"
              : t("profile.noBetsOtherProfile") ||
                "This user hasn't made any predictions yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {profile.bets.map((group) => (
            <GroupBetCard key={group.group} group={group} t={t} />
          ))}
        </div>
      )}

      <AvatarSelectionModal
        isOpen={isAvatarModalOpen}
        currentAvatar={
          resolvedAvatar != null ? Number(resolvedAvatar) : undefined
        }
        onClose={() => setIsAvatarModalOpen(false)}
        onSave={handleSaveAvatar}
      />
    </div>
  );
}

function GroupBetCard({
  group,
  t,
}: {
  group: MatchGroupResponse;
  t: TFunction;
}) {
  const isKnockout = !/^[A-L]$/.test(group.group);

  const groupName = isKnockout
    ? t(`dashboard.${group.group}`) || group.group
    : `${t("dashboard.groupStage") || "Group"} ${group.group}`;

  return (
    <div className="bg-card border border-border rounded-xl hover:border-primary/30 transition-colors overflow-hidden">
      <div className="bg-secondary/30 px-5 py-3 border-b border-border flex justify-between items-center">
        <h3 className="font-bold text-foreground">{groupName}</h3>
        <span className="text-xs font-medium text-muted-foreground bg-secondary px-2 py-1 rounded">
          {group.matches.filter((m) => m.userBet !== null).length}/
          {group.matches.length} {t("profile.predicted") || "predicted"}
        </span>
      </div>

      <div className="divide-y divide-border">
        {group.matches.map((match) => (
          <div
            key={match.id}
            className="p-4 sm:px-5 flex flex-col sm:flex-row items-center gap-4 justify-between"
          >
            {/* Match Date (Mobile stacked, desktop side) */}
            <div className="text-xs text-muted-foreground sm:w-24 text-center sm:text-left shrink-0">
              {new Date(match.dateTime).toLocaleDateString()}
              <div className="hidden sm:block mt-0.5">
                {new Date(match.dateTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>

            {/* Teams and Score Wrapper */}
            <div className="flex-1 flex items-center justify-center gap-3 sm:gap-6 w-full">
              {/* Home Team */}
              <div className="flex-1 flex items-center justify-end gap-2 sm:gap-3 text-right">
                <span className="font-medium text-sm sm:text-base line-clamp-1">
                  {match.homeTeam}
                </span>
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full overflow-hidden shrink-0 border border-border/50 bg-secondary">
                  <img
                    src={match.homeTeamFlag}
                    alt={match.homeTeam}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Score Box (Read-Only Bet) */}
              <div className="flex items-center gap-2 bg-secondary/30 border border-border rounded-lg px-3 py-1.5 shrink-0">
                <span className="text-lg font-black w-6 text-center text-foreground">
                  {match.userBet?.homeScore ?? "-"}
                </span>
                <span className="text-muted-foreground text-sm font-bold">
                  X
                </span>
                <span className="text-lg font-black w-6 text-center text-foreground">
                  {match.userBet?.awayScore ?? "-"}
                </span>
              </div>

              {/* Away Team */}
              <div className="flex-1 flex items-center justify-start gap-2 sm:gap-3 text-left">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full overflow-hidden shrink-0 border border-border/50 bg-secondary">
                  <img
                    src={match.awayTeamFlag}
                    alt={match.awayTeam}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="font-medium text-sm sm:text-base line-clamp-1">
                  {match.awayTeam}
                </span>
              </div>
            </div>

            {/* Status (Optional Placeholder for match status if needed) */}
            <div className="text-xs sm:w-20 text-center sm:text-right shrink-0">
              <span
                className={`px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider ${
                  match.status === "FINISHED"
                    ? "bg-border/50 text-muted-foreground"
                    : "bg-primary/20 text-primary"
                }`}
              >
                {match.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
